import { ImageResponse } from 'next/og';
import { createServerClient } from '@/src/lib/api/server.client';
import { getSoftwareBySlug } from '@/src/api/software/software.api';
import fs, { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const client = await createServerClient();

    // Load font
    let fontPath = path.join(process.cwd(), 'assets', 'ARIALBD.ttf');
    if (!existsSync(fontPath)) {
        fontPath = path.join(
            process.cwd(),
            'frontend',
            'assets',
            'ARIALBD.ttf',
        );
    }
    const arialBoldData = await readFile(fontPath);

    let software;
    try {
        software = await getSoftwareBySlug(client, slug);
    } catch (e) {
        software = null;
    }

    return new ImageResponse(
        <div
            style={{
                background: '#000000',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '60px 80px',
                color: 'white',
                fontFamily: 'Arial',
            }}
        >
            {/* Main block */}
            <div
                style={{
                    display: 'flex',
                    height: '485px',
                    width: '100%',
                }}
            >
                {!software ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexGrow: 1,
                        }}
                    >
                        <h1
                            style={{
                                fontSize: 80,
                                fontWeight: 900,
                                marginBottom: '20px',
                            }}
                        >
                            Invalid Software
                        </h1>
                        <p
                            style={{
                                fontSize: 32,
                                color: '#52525b',
                                fontWeight: 700,
                            }}
                        >
                            There are no software with this slug.
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexGrow: 1,
                        }}
                    >
                        {/* Text Block */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                flex: 1,
                                paddingRight: '40px',
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: 96,
                                    fontWeight: 900,
                                    marginBottom: '24px',
                                    textAlign: 'left',
                                    lineHeight: 1.0,
                                    letterSpacing: '-0.04em',
                                }}
                            >
                                {software.name}
                            </h1>
                            {software.shortDescription && (
                                <p
                                    style={{
                                        fontSize: 34,
                                        color: '#a1a1aa', // zinc-400
                                        textAlign: 'left',
                                        lineHeight: 1.4,
                                        fontWeight: 700,
                                    }}
                                >
                                    {software.shortDescription}
                                </p>
                            )}
                        </div>
                        {/* Logo Block */}
                        {software.logoUrl && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end', // Push to the right
                                    alignItems: 'center',
                                    width: '400px',
                                    height: '400px',
                                }}
                            >
                                <img
                                    src={software.logoUrl}
                                    alt={software.name}
                                    style={{
                                        maxWidth: '400px',
                                        maxHeight: '400px',
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                        )}
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
