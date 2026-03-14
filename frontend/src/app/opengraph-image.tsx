import { ImageResponse } from 'next/og';
import fs from 'fs/promises';
import path from 'path';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    const fontPath = path.join(process.cwd(), 'assets/ARIALBD.ttf');
    const arialBoldData = await fs.readFile(fontPath);

    const logoPath = path.join(process.cwd(), 'assets/logo.svg');
    let logoDataUrl = '';
    try {
        const logoBuffer = await fs.readFile(logoPath);
        const base64Logo = logoBuffer.toString('base64');
        logoDataUrl = `data:image/svg+xml;base64,${base64Logo}`;
    } catch (e) {
        console.error('Failed to read logo.svg:', e);
    }

    return new ImageResponse(
        <div
            style={{
                background: '#000000',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '60px 80px',
                color: 'white',
                fontFamily: 'Arial',
            }}
        >
            {/* Main content */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '485px',
                    flexGrow: 1,
                    width: '100%',
                }}
            >
                {/* Left text */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        flex: 1,
                    }}
                >
                    <h1
                        style={{
                            fontSize: 100,
                            fontWeight: 900,
                            display: 'flex',
                            flexDirection: 'column',
                            lineHeight: 1.1,
                            letterSpacing: '-0.04em',
                        }}
                    >
                        <span style={{ color: 'white' }}>Find the perfect</span>
                        <span
                            style={{
                                backgroundImage:
                                    'linear-gradient(to right, #9f9fa9, #52525c)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            stack
                        </span>
                    </h1>
                    <p
                        style={{
                            textAlign: 'center',
                            fontSize: 22,
                            color: '#52525b', // zinc-600
                            maxWidth: '600px',
                            lineHeight: 1.3,
                            fontWeight: 300,
                            marginTop: '20px',
                        }}
                    >
                        Search through our database of software, libraries, and
                        tools to build your next big project.
                    </p>
                </div>

                {/* Logo */}
                {logoDataUrl && (
                    <div style={{ display: 'flex', marginLeft: '10px' }}>
                        <img
                            src={logoDataUrl}
                            alt="Logo"
                            width="300"
                            height="300"
                            style={{
                                objectFit: 'contain',
                                opacity: 0.8,
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                {/* Line */}
                <div
                    style={{
                        width: '100%',
                        height: '1px',
                        background: '#27272a',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '10px',
                    }}
                >
                    <div
                        style={{
                            fontSize: 54,
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            backgroundImage:
                                'linear-gradient(to right, #9f9fa9, #52525c)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        betterstack.tech
                    </div>
                </div>
            </div>
        </div>,
        {
            ...size,
            fonts: [
                {
                    name: 'Arial',
                    data: arialBoldData,
                    style: 'normal',
                    weight: 700,
                },
            ],
        },
    );
}
