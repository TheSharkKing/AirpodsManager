import React from 'react';
import { setMode } from '../services/bluetooth';
import { MODES } from '../utils/constants';

interface ModeSwitchProps {
    currentMode: typeof MODES[keyof typeof MODES];
    onModeChange: (mode: typeof MODES[keyof typeof MODES]) => void;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ currentMode, onModeChange }) => {
    const toggleMode = async () => {
        const newMode = currentMode === MODES.NOISE_CANCELLATION ? MODES.TRANSPARENCY : MODES.NOISE_CANCELLATION;
        try {
            await setMode(newMode);
            onModeChange(newMode);
        } catch (error) {
            console.error('Failed to switch mode:', error);
            // Let the parent component handle the error through the connection state
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