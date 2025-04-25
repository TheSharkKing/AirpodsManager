import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ModeSwitch from './components/ModeSwitch';
import StatusIndicator from './components/StatusIndicator';
import { connect, disconnect } from './services/bluetooth';
import { MODES } from './utils/constants';

const App: React.FC = () => {
    const [currentMode, setCurrentMode] = useState(MODES.NOISE_CANCELLATION);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const initBluetooth = async () => {
            try {
                await connect();
                setIsConnected(true);
            } catch (error) {
                console.error('Failed to connect:', error);
            }
        };

        initBluetooth();
        return () => {
            disconnect();
        };
    }, []);

    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            minHeight: '100vh',
            backgroundColor: '#f5f5f7'
        }}>
            <Header />
            <main style={{ padding: '20px' }}>
                {isConnected ? (
                    <>
                        <StatusIndicator mode={currentMode} />
                        <ModeSwitch currentMode={currentMode} onModeChange={setCurrentMode} />
                    </>
                ) : (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '40px',
                        color: '#666'
                    }}>
                        Connecting to AirPods...
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;