// src/services/bluetooth.ts

import { MODES } from '../utils/constants';

let device: BluetoothDevice | null = null;
let characteristic: BluetoothRemoteGATTCharacteristic | null = null;

export const connect = async (): Promise<void> => {
    try {
        device = await navigator.bluetooth.requestDevice({
            filters: [
                {
                    namePrefix: 'AirPods'
                }
            ],
            optionalServices: ['00001101-0000-1000-8000-00805F9B34FB']
        });

        const server = await device.gatt?.connect();
        if (!server) throw new Error('Failed to connect to GATT server');

        const service = await server.getPrimaryService('00001101-0000-1000-8000-00805F9B34FB');
        characteristic = await service.getCharacteristic('00001101-0000-1000-8000-00805F9B34FB');

        device.addEventListener('gattserverdisconnected', onDisconnected);
    } catch (error) {
        console.error('Error connecting to AirPods:', error);
        throw error;
    }
};

export const disconnect = async (): Promise<void> => {
    if (device) {
        device.removeEventListener('gattserverdisconnected', onDisconnected);
        if (device.gatt?.connected) {
            device.gatt.disconnect();
        }
    }
    device = null;
    characteristic = null;
};

const onDisconnected = () => {
    console.log('Device disconnected');
    device = null;
    characteristic = null;
};

export const setMode = async (mode: typeof MODES[keyof typeof MODES]): Promise<void> => {
    if (!characteristic) {
        throw new Error('Bluetooth not connected');
    }

    // Convert mode to command bytes
    const command = new Uint8Array([
        mode === MODES.NOISE_CANCELLATION ? 0x01 : 0x02
    ]);

    try {
        await characteristic.writeValue(command);
    } catch (error) {
        console.error('Error setting mode:', error);
        throw error;
    }
};