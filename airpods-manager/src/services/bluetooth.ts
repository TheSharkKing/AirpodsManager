import { MODES, BLUETOOTH_SERVICE_UUID, NOISE_CONTROL_CHARACTERISTIC_UUID } from '../utils/constants';

let device: BluetoothDevice | null = null;
let characteristic: BluetoothRemoteGATTCharacteristic | null = null;
let isReconnecting = false;

const checkBluetoothSupport = (): void => {
    if (!navigator.bluetooth) {
        throw new Error('Bluetooth is not supported in this browser');
    }
};

export const connect = async (): Promise<void> => {
    if (isReconnecting) return;
    
    try {
        checkBluetoothSupport();
        device = await navigator.bluetooth.requestDevice({
            filters: [
                {
                    namePrefix: 'AirPods'
                }
            ],
            optionalServices: [BLUETOOTH_SERVICE_UUID]
        });

        if (!device) {
            throw new Error('No device selected');
        }

        await connectToDevice();
    } catch (error) {
        console.error('Error connecting to AirPods:', error);
        throw error;
    }
};

const connectToDevice = async (): Promise<void> => {
    if (!device || !device.gatt) {
        throw new Error('No device available');
    }

    try {
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(BLUETOOTH_SERVICE_UUID);
        characteristic = await service.getCharacteristic(NOISE_CONTROL_CHARACTERISTIC_UUID);

        if (!characteristic) {
            throw new Error('Could not access noise control characteristic');
        }

        device.addEventListener('gattserverdisconnected', onDisconnected);
    } catch (error) {
        console.error('Error establishing GATT connection:', error);
        throw error;
    }
};

export const disconnect = async (): Promise<void> => {
    isReconnecting = false;
    
    if (device) {
        device.removeEventListener('gattserverdisconnected', onDisconnected);
        if (device.gatt?.connected) {
            device.gatt.disconnect();
        }
    }
    device = null;
    characteristic = null;
};

const onDisconnected = async () => {
    console.log('Device disconnected');
    characteristic = null;

    // Attempt to reconnect with backoff
    if (!isReconnecting && device) {
        isReconnecting = true;
        console.log('Attempting to reconnect...');
        
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
                await connectToDevice();
                console.log('Reconnected successfully');
                isReconnecting = false;
                return;
            } catch (error) {
                console.error(`Reconnection attempt ${retryCount + 1} failed:`, error);
                retryCount++;
            }
        }
        
        isReconnecting = false;
        throw new Error('Failed to reconnect after multiple attempts');
    }
};

export const setMode = async (mode: typeof MODES[keyof typeof MODES]): Promise<void> => {
    if (!characteristic || !device?.gatt?.connected) {
        throw new Error('Bluetooth not connected');
    }

    // Convert mode to command bytes (0x00 for off, 0x01 for ANC, 0x02 for transparency)
    const command = new Uint8Array([
        mode === MODES.NOISE_CANCELLATION ? 0x01 : 0x02
    ]);

    try {
        await characteristic.writeValueWithoutResponse(command);
    } catch (error) {
        console.error('Error setting mode:', error);
        throw error;
    }
};

export const isConnected = (): boolean => {
    return device?.gatt?.connected ?? false;
};