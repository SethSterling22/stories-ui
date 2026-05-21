import React, { useEffect, useState } from 'react';

const Callback: React.FC = () => {
    const [errorLog, setErrorLog] = useState<string | null>(null);
    // Controls whether we display the loading UI (prevents the initial flash effect)
    const [showUi, setShowUi] = useState(false);

    useEffect(() => {
        // 1. Safely extract the token from the URL (Supports both ?access_token and #access_token)
        const url = window.location.href;
        let token: string | null = null;

        if (url.includes('access_token=')) {
        const match = url.match(/access_token=([^&]*)/);
        token = match ? match[1] : null;
        }

        const savedOrigin = sessionStorage.getItem('oauth_original_origin');
        const currentOrigin = window.location.origin;

        if (token) {
        // CASE A: We originated from localhost but TACC sent us back to the production Pod
        if (savedOrigin && savedOrigin !== currentOrigin) {
            sessionStorage.removeItem('oauth_original_origin');
            window.location.href = `${savedOrigin}/callback?access_token=${token}`;
            return;
        }

        // CASE B: We are already on the correct environment (Local or Production)
        try {
            // Save the token under the exact key expected by your AuthProvider
            localStorage.setItem('access_token', token);
            sessionStorage.removeItem('oauth_original_origin');

            // Immediate redirection without artificial delays to prevent flickering
            window.location.href = '/';
            return;
        } catch (error: any) {
            console.error("Error saving credentials to localStorage:", error);
            setErrorLog(`Local storage error: ${error.message || error}`);
            setShowUi(true);
        }
        } else {
        // If there is no token present, it indicates a configuration mismatch
        setErrorLog("The TACC OAuth response did not contain a valid access token.");
        setShowUi(true);
        }

        // ANTI-FLASH STRATEGY: If redirection takes longer than 150ms for any reason,
        // we smoothly fade in the loading UI so the application doesn't look frozen.
        const uiTimeout = setTimeout(() => {
        setShowUi(true);
        }, 150);

        return () => clearTimeout(uiTimeout);
    }, []);

    // If a critical authentication error occurs, break the flow and display the message
    if (errorLog) {
        return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7f1d1d', color: '#fff', fontFamily: 'sans-serif', padding: '2rem' }}>
            <div style={{ background: '#991b1b', padding: '2rem', borderRadius: '0.5rem', maxWidth: '500px' }}>
            <h3 style={{ marginTop: 0 }}>⚠️ Authentication Error</h3>
            <p>{errorLog}</p>
            <button onClick={() => window.location.href = '/login'} style={{ background: '#fff', color: '#991b1b', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>
                Back to Login
            </button>
            </div>
        </div>
        );
    }

    // If showUi is false, this renders an empty, invisible container.
    // The user experiences a seamless transition straight to the dashboard.
    return (
        <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#111827', 
        color: '#ffffff', 
        fontFamily: 'system-ui, sans-serif',
        opacity: showUi ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out' // Smooth fade-in if the UI is triggered
        }}>
        {showUi && (
            <div style={{ textAlign: 'center', padding: '2.5rem', background: '#1f2937', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', maxWidth: '400px', width: '90%' }}>
            <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', margin: '0 auto 1.5rem auto', animation: 'spin 1s linear infinite' }}></div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Synchronizing with TACC</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Establishing secure session...</p>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
            </div>
        )}
        </div>
    );
};

export default Callback;