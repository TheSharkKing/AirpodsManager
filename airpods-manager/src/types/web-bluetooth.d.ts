interface BluetoothDevice extends EventTarget {
    readonly id: string;
    readonly name?: string;
    readonly gatt?: BluetoothRemoteGATTServer;
    forget(): Promise<void>;
}

interface BluetoothRemoteGATTServer {
    device: BluetoothDevice;
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string | number): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
    device: BluetoothDevice;
    uuid: string;
    getCharacteristic(characteristic: string | number): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
    service: BluetoothRemoteGATTService;
    uuid: string;
    value?: DataView;
    writeValue(value: BufferSource): Promise<void>;
    writeValueWithoutResponse(value: BufferSource): Promise<void>;
}

interface Navigator {
    bluetooth: {
        requestDevice(options: {
            filters: Array<{ namePrefix?: string; services?: string[]; }>;
            optionalServices?: string[];
        }): Promise<BluetoothDevice>;
    };
}

declare global {
    interface Navigator {
        bluetooth: {
            requestDevice(options: {
                filters: Array<{ namePrefix?: string; services?: string[]; }>;
                optionalServices?: string[];
            }): Promise<BluetoothDevice>;
        };
    }
}