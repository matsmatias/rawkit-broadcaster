import { WebSocket } from 'https://deno.land/std@0.98.0/ws/mod.ts';
import { v4 } from 'https://deno.land/std@0.98.0/uuid/mod.ts';


class ChannelClient {
    id: string;
    websocket: WebSocket;

    constructor(websocket: WebSocket) {
        this.id = v4.generate();
        this.websocket = websocket;
    }
}

export default ChannelClient;
