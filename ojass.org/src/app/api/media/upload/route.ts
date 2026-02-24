import connectToDatabase from '@/lib/mongodb';
import Media from '@/models/Media';
import { deleteFilesFromCloudinary, uploadFilesToCloudinary } from '@/utils/cloudinary.util';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Configure max file size (1MB)
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

export async function POST(request: NextRequest) {
    try {

    // Check authentication
        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const token = authHeader.slice(7).trim();
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.error('JWT_SECRET not configured');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        let decoded: { userId: string; email: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Get form data
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const userId = formData.get('userId') as string | null;
        const isIdCard = formData.get('isIdCard') === 'true';

        if(decoded.userId !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Validate input
        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            );
        }

        // Validate file size and convert to buffer format
        const fileBuffers = [];
        for (const file of files) {
            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    { error: `File ${file.name} exceeds maximum size of 1MB` },
                    { status: 400 }
                );
            }

            // Convert File to buffer format expected by Cloudinary utility
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            fileBuffers.push({
                buffer: buffer,
                mimetype: file.type,
                originalname: file.name,
                size: file.size
            });
        }

        // Upload to Cloudinary
        const uploadResults = await uploadFilesToCloudinary(fileBuffers, {
            folder: 'ojass2026',
            resource_type: 'auto'
        });

        // DB connection is initialized on module import (see src/lib/mongodb.ts)

        // Ensure initial DB connection has completed to avoid buffering timeouts
        // Ensure DB connection — call connectToDatabase which will return cached.conn
        try {
            await connectToDatabase();
        } catch (connErr) {
            console.error('Upload: DB connection failed before insert', connErr);
            return NextResponse.json(
                { error: 'Database connection error' },
                { status: 500 }
            );
        }

        // Save file metadata to database
        const mediaDocuments = [];
        for (let i = 0; i < uploadResults.length; i++) {
            const result = uploadResults[i];
            const file = files[i];

            const mediaDoc = new Media({
                userId: userId || null,
                publicId: result.public_id,
                url: result.url,
                fileName: (result as { original_filename?: string }).original_filename || file.name,
                fileType: file.type,
                fileSize: (result as { bytes?: number }).bytes || file.size,
                resourceType: (result as { resource_type?: string }).resource_type || 'image',
                folder: 'ojass2026',
                isIdCard: isIdCard || false
            });

            await mediaDoc.save();
            mediaDocuments.push(mediaDoc);
        }

        // Format response (include `imageUrl` and `cloudinaryId` for client convenience)
        const response = mediaDocuments.map(doc => ({
            fileId: doc._id.toString(),
            // legacy keys
            publicId: doc.publicId,
            url: doc.url,
            // new/explicit keys requested
            cloudinaryId: doc.publicId,
            imageUrl: doc.url,
            fileName: doc.fileName,
            fileType: doc.fileType,
            fileSize: doc.fileSize,
            resourceType: doc.resourceType,
            isIdCard: doc.isIdCard,
            createdAt: doc.createdAt
        }));

        return NextResponse.json(
            {
                message: files.length === 1 ? 'File uploaded successfully' : 'Files uploaded successfully',
                files: response
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('File upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {

        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const token = authHeader.slice(7).trim();
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.error('JWT_SECRET not configured');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        let decoded: { userId: string; email: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        const { idCardCloudinaryId } = await request.json();

        const media = await Media.findOne({ publicId: idCardCloudinaryId });
        if (!media) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        await deleteFilesFromCloudinary([media.publicId]);
        await media.deleteOne();

        return NextResponse.json(
            { message: 'File deleted successfully' },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('File delete error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}