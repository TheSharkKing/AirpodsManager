import React, { useState } from 'react';
import { setMode } from '../services/bluetooth';
import { MODES } from '../utils/constants';

const ModeSwitch: React.FC = () => {
    const [currentMode, setCurrentMode] = useState(MODES.NOISE_CANCELLATION);

    const toggleMode = async () => {
        const newMode = currentMode === MODES.NOISE_CANCELLATION ? MODES.TRANSPARENCY : MODES.NOISE_CANCELLATION;
        try {
            await setMode(newMode);
            setCurrentMode(newMode);
        } catch (error) {
            console.error('Failed to switch mode:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <button 
                onClick={toggleMode}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#007AFF',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                }}
            >
                Switch to {currentMode === MODES.NOISE_CANCELLATION ? MODES.TRANSPARENCY : MODES.NOISE_CANCELLATION}
            </button>
        </div>
    );
};

export default ModeSwitch;