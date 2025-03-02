import { ReadPacket, Serializer } from '../interfaces';
export declare class MqttRecordSerializer implements Serializer<ReadPacket, string> {
    serialize(packet: ReadPacket): string;
}
