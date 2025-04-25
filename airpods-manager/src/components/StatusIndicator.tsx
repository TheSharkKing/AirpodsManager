import React from 'react';
import { MODES } from '../utils/constants';

interface StatusIndicatorProps {
    mode: typeof MODES[keyof typeof MODES];
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ mode }) => {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{
                display: 'inline-block',
                padding: '10px 20px',
                borderRadius: '20px',
                backgroundColor: mode === MODES.NOISE_CANCELLATION ? '#007AFF' : '#34C759',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                {mode}
            </div>
        </div>
    );
};

export default StatusIndicator;