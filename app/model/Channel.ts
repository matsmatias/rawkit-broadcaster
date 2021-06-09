import ChannelClient from './ChannelClient.ts';


class Channel {
    name: string;
    clients: ChannelClient[];

    constructor(name: string, initialClient: ChannelClient) {
        this.name = name;
        this.clients = [initialClient];
    }

    addClient(channelClient: ChannelClient): void {
        this.clients.push(channelClient);
    }

    refreshClients(): void {
        this.clients.filter(client => !client.websocket.isClosed);
    }
}

export default Channel;
