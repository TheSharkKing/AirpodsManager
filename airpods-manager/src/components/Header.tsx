import React from 'react';

const Header: React.FC = () => {
    return (
        <header style={{
            backgroundColor: '#007AFF',
            padding: '20px',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h1 style={{ margin: 0, fontSize: '24px' }}>AirPods Manager</h1>
        </header>
    );
};

export default Header;