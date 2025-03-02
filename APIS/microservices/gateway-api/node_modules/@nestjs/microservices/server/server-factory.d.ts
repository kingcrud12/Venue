import { MicroserviceOptions } from '../interfaces';
import { ServerGrpc } from './server-grpc';
import { ServerKafka } from './server-kafka';
import { ServerMqtt } from './server-mqtt';
import { ServerNats } from './server-nats';
import { ServerRedis } from './server-redis';
import { ServerRMQ } from './server-rmq';
import { ServerTCP } from './server-tcp';
export declare class ServerFactory {
    static create(microserviceOptions: MicroserviceOptions): ServerGrpc | ServerKafka | ServerMqtt | ServerRedis | ServerRMQ | ServerTCP | ServerNats<import("..").NatsEvents, import("..").NatsStatus>;
}
