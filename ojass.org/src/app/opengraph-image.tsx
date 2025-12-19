import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'OJASS 2026'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: 'black',
                    color: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    OJASS 2026
                </div>
                <div style={{ fontSize: 48, marginTop: 20, color: '#aaaaaa' }}>
                    NIT Jamshedpur
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
