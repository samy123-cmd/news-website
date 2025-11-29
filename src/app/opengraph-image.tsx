import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Global AI News';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #0F172A, #000000)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #38BDF8, #3B82F6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '40px',
                            fontWeight: 'bold',
                            color: 'white',
                            boxShadow: '0 0 40px rgba(56, 189, 248, 0.4)',
                        }}
                    >
                        AI
                    </div>
                </div>
                <div
                    style={{
                        fontSize: '80px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '10px',
                        letterSpacing: '-2px',
                    }}
                >
                    Global AI News
                </div>
                <div
                    style={{
                        fontSize: '30px',
                        color: '#94A3B8',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        fontWeight: 'bold',
                    }}
                >
                    Premium • Curated • Real-time
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
