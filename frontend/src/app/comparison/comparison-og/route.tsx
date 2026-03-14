import { ImageResponse } from 'next/og';
import { createServerClient } from '@/src/lib/api/server.client';
import {
    compareSoftware,
    getSoftwareBySlug,
} from '@/src/api/software/software.api';
import fs from 'fs/promises';
import path from 'path';
import { SoftwareComparisonSide } from '@/src/api/software/software.schemas';

export const runtime = 'nodejs'; // Required for fs

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const firstSoft = searchParams.get('firstSoft');
    const secondSoft = searchParams.get('secondSoft');

    const client = await createServerClient();

    // Load font
    const fontPath = path.join(process.cwd(), 'assets/ARIALBD.ttf');
    const arialBoldData = await fs.readFile(fontPath);

    // Fetch data
    const softwareComparison =
        firstSoft && secondSoft
            ? await compareSoftware(client, firstSoft, secondSoft).catch(
                  () => null,
              )
            : null;
    const [soft1, soft2] = [
        softwareComparison?.softwareA,
        softwareComparison?.softwareB,
    ];

    const isValidComparison =
        softwareComparison && soft1 && soft2 && soft1.id !== soft2.id;

    const renderSoftwareColumn = (software: SoftwareComparisonSide) => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '450px',
            }}
        >
            {software.logoUrl ? (
                <img
                    src={software.logoUrl}
                    alt={software.name}
                    width="240"
                    height="240"
                    style={{ objectFit: 'contain', marginBottom: '30px' }}
                />
            ) : (
                <div
                    style={{
                        width: '240px',
                        height: '240px',
                        background: '#18181b',
                        borderRadius: '20px',
                        marginBottom: '30px',
                    }}
                />
            )}
            <h2
                style={{
                    fontSize: 44,
                    fontWeight: 900,
                    marginBottom: '15px',
                    textAlign: 'center',
                    lineHeight: 1.1,
                }}
            >
                {software.name}
            </h2>
            <p
                style={{
                    fontSize: 24,
                    color: '#a1a1aa',
                    textAlign: 'center',
                    lineHeight: 1.4,
                    fontWeight: 700,
                }}
            >
                {software.shortDescription.slice(0, 70)}
            </p>
        </div>
    );

    return new ImageResponse(
        <div
            style={{
                background: '#000000',
                width: '1200px',
                height: '630px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '60px 80px',
                color: 'white',
                fontFamily: 'Arial',
            }}
        >
            <div style={{ height: '485px', display: 'flex' }}>
                {!isValidComparison ? (
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
                            Invalid Comparison
                        </h1>
                        <p
                            style={{
                                fontSize: 32,
                                color: '#52525b',
                                fontWeight: 700,
                            }}
                        >
                            Please select two different software items with one
                            common category.
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
                            width: '100%',
                        }}
                    >
                        {renderSoftwareColumn(soft1)}
                        <div
                            style={{
                                fontSize: 40,
                                fontWeight: 900,
                                color: '#27272a',
                                margin: '0 20px',
                            }}
                        >
                            VS
                        </div>
                        {renderSoftwareColumn(soft2)}
                    </div>
                )}
            </div>
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
                            color: 'transparent',
                        }}
                    >
                        betterstack.tech
                    </div>
                </div>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
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
