import { ClientProxy } from './client/client-proxy';
export declare class ClientsContainer {
    private clients;
    getAllClients(): ClientProxy[];
    addClient(client: ClientProxy): void;
    clear(): void;
}
