"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLoginTheme } from "@/components/login/theme";
import {
    User,
    Code,
    Users,
    Zap,
    Mail,
    Phone,
    Shield,
    Upload,
    X,
    Image as ImageIcon,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Profile({ profileData }: { profileData: any }) {
    const theme = useLoginTheme();
    const [idCardImageUrl, setIdCardImageUrl] = useState<string | null>(
        profileData?.idCardImageUrl || null,
    );
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch ID card on mount
    useEffect(() => {
        const fetchIdCard = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch("/api/user/id-card", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.idCardImageUrl) {
                        setIdCardImageUrl(data.idCardImageUrl);
                        // Update profileData in parent if needed
                    }
                }
            } catch (err) {
                console.error("Error fetching ID card:", err);
            }
        };
        fetchIdCard();
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setUploadError("Please select an image file");
            return;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setUploadError("File size must be less than 10MB");
            return;
        }

        setUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        try {
            const token = localStorage.getItem("token");
            const userId = profileData?._id;

            if (!token || !userId) {
                throw new Error("Authentication required");
            }

            // Step 1: Upload file to media API
            const formData = new FormData();
            formData.append("files", file);
            formData.append("userId", userId);
            formData.append("isIdCard", "true");

            const uploadRes = await fetch("/api/media/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                const errorData = await uploadRes.json();
                throw new Error(errorData.error || "Upload failed");
            }

            const uploadData = await uploadRes.json();
            const uploadedFile = uploadData.files[0];

            // Step 2: Update user's ID card fields
            const updateRes = await fetch("/api/user/id-card", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idCardImageUrl: uploadedFile.url,
                    idCardCloudinaryId: uploadedFile.cloudinaryId,
                }),
            });

            if (!updateRes.ok) {
                const errorData = await updateRes.json();
                throw new Error(errorData.error || "Failed to update ID card");
            }

            // Update local state
            setIdCardImageUrl(uploadedFile.url);
            setUploadSuccess(true);

            // Update localStorage user data
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            user.idCardImageUrl = uploadedFile.url;
            user.idCardCloudinaryId = uploadedFile.cloudinaryId;
            localStorage.setItem("user", JSON.stringify(user));

            // Clear success message after 3 seconds
            setTimeout(() => {
                setUploadSuccess(false);
            }, 3000);
        } catch (err: any) {
            console.error("ID card upload error:", err);
            setUploadError(err.message || "Failed to upload ID card");
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveIdCard = async () => {
        if (!confirm("Are you sure you want to remove your ID card?")) {
            return;
        }

        setUploading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");

            const res = await fetch("/api/user/id-card", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idCardImageUrl: "",
                    idCardCloudinaryId: "",
                }),
            });

            if (res.ok) {
                setIdCardImageUrl(null);
                // Update localStorage
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                user.idCardImageUrl = null;
                user.idCardCloudinaryId = null;
                localStorage.setItem("user", JSON.stringify(user));
                setUploadSuccess(true); // Reusing success state to show a message? Logic below might need check.
                // Actually let's not reuse uploadSuccess for delete as it might say "ID card uploaded successfully!"
            }
        } catch (err) {
            console.error("Error removing ID card:", err);
            setUploadError("Failed to remove ID card");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6 relative px-2 pb-8">
            {/* Avatar */}
            <div className="relative flex items-center justify-center mb-8 mt-2">
                <div
                    className={cn(
                        "relative w-24 h-24 flex items-center justify-center rounded-full border-2 bg-black/50 p-1",
                        theme.borderColor,
                    )}>
                    <div
                        className={cn(
                            "w-full h-full rounded-full flex items-center justify-center overflow-hidden",
                            theme.accentBgDim,
                        )}>
                        <User size={40} className={theme.textColor} />
                    </div>
                    {/* Badge */}
                    <div
                        className={cn(
                            "absolute -bottom-2 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border shadow-lg",
                            theme.accentBg,
                            theme.borderColor,
                        )}>
                        {profileData.role || "MEMBER"}
                    </div>
                </div>
            </div>

            {/* Name + Ojass ID */}
            <div className="text-center relative mb-8">
                <h2
                    className={cn(
                        "text-2xl font-bold mb-1 tracking-wide",
                        theme.textColor,
                    )}>
                    {profileData.name}
                </h2>
                <p
                    className={cn(
                        "font-mono text-xs opacity-60 tracking-wider",
                        theme.textColorDim,
                    )}>
                    ID: {profileData.ojassId}
                </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-3">
                {[
                    { icon: Mail, label: "Email", value: profileData.email },
                    { icon: Phone, label: "Phone", value: profileData.phone },
                    { icon: Zap, label: "College", value: profileData.college },
                    { icon: Code, label: "Gender", value: profileData.gender },
                    { icon: Users, label: "City", value: profileData.city },
                    { icon: Shield, label: "State", value: profileData.state },
                    {
                        icon: Users,
                        label: "Referrals",
                        value: profileData.referralCount || 0,
                    },
                ].map(({ icon: Icon, label, value }, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 hover:bg-white/5",
                            "border-white/5 bg-white/5", // Clean default
                        )}>
                        <div
                            className={cn("p-2 rounded-md", theme.accentBgDim)}>
                            <Icon size={18} className={theme.textColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span
                                className={cn(
                                    "text-[10px] uppercase tracking-wider font-semibold block mb-0.5 opacity-50",
                                    theme.textColorSlate,
                                )}>
                                {label}
                            </span>
                            <p
                                className={cn(
                                    "text-sm font-medium truncate",
                                    theme.textColor,
                                )}>
                                {value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ID Card Upload Section */}
            <div
                className={cn(
                    "p-6 rounded-xl border relative overflow-hidden mt-6",
                    theme.borderColorDim,
                    theme.bgGlass,
                )}>
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                    <ImageIcon size={20} className={theme.textColor} />
                    <h3
                        className={cn(
                            "font-bold text-sm uppercase tracking-wider",
                            theme.textColor,
                        )}>
                        ID Card Verification
                    </h3>
                </div>

                {uploadError && (
                    <div className="mb-4 p-3 text-xs rounded bg-red-500/10 text-red-300 border border-red-500/30">
                        {uploadError}
                    </div>
                )}

                {uploadSuccess && (
                    <div className="mb-4 p-3 text-xs rounded bg-green-500/10 text-green-300 border border-green-500/30 flex items-center gap-2">
                        <Check size={14} />
                        ID card updated successfully!
                    </div>
                )}

                {idCardImageUrl ? (
                    <div className="space-y-4">
                        <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black/40 p-2">
                            <img
                                src={idCardImageUrl}
                                alt="ID Card"
                                className="w-full h-auto max-h-48 object-contain"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className={cn(
                                    "flex-1 py-2 px-4 rounded border text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2",
                                    theme.buttonOutline,
                                )}>
                                {uploading && <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>}
                                {uploading ? "UPLOADING..." : "CHANGE CARD"}
                            </button>
                            <button
                                onClick={handleRemoveIdCard}
                                disabled={uploading}
                                className="py-2 px-4 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-xs">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div
                            onClick={() => !uploading && fileInputRef.current?.click()}
                            className={cn(
                                "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:bg-white/5 min-h-[160px] flex flex-col items-center justify-center",
                                theme.borderColorDim,
                                uploading && "opacity-50 cursor-not-allowed"
                            )}>
                            {uploading ? (
                                <div className="flex flex-col items-center animate-pulse">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-4"></div>
                                    <p
                                        className={cn(
                                            "text-xs font-medium mb-1",
                                            theme.textColor,
                                        )}>
                                        Uploading to Server...
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <Upload
                                        size={32}
                                        className={cn(
                                            "mx-auto mb-4 opacity-50",
                                            theme.textColor,
                                        )}
                                    />
                                    <p
                                        className={cn(
                                            "text-xs font-medium mb-1",
                                            theme.textColor,
                                        )}>
                                        Drop your ID card here
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        (College/University ID) • Max 10MB
                                    </p>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className={cn(
                                "w-full py-3 px-4 rounded border text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2",
                                theme.buttonPrimary,
                                uploading && "opacity-50 cursor-not-allowed",
                            )}>
                            {uploading && <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>}
                            {uploading ? "Uploading..." : "Upload Document"}
                        </button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>
        </div>
    );
}
