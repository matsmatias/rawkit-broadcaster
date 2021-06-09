import { WebSocket } from 'https://deno.land/std/ws/mod.ts';
import { Redis } from 'https://deno.land/x/redis@v0.22.1/mod.ts';

import Channel from '../model/Channel.ts';
import ChannelClient from '../model/ChannelClient.ts';


class ChannelManager {
  redis: Redis;
  channelMap: Map<string, Channel>;

  constructor(redis: Redis) {
    this.redis = redis;
    this.channelMap = new Map<string, Channel>();
  }

  async addToChannel(channelName: string, connection: WebSocket) {
    const channelClient = new ChannelClient(connection);

    let channel = this.channelMap.get(channelName);
    
    if (channel) {
      channel.addClient(channelClient);
    }
    else {
      channel = new Channel(channelName, channelClient);
      this.channelMap.set(channelName, channel);

      const sub = await this.redis.subscribe(channelName);
      (async function() {
        for await (const { channel: redisChannel, message } of sub.receive()) {
          if (channel.name === redisChannel) {
            channel.clients.forEach(async (client) => {
              try {
                if (!client.websocket.isClosed) await client.websocket.send(message);
              } catch (e) {
                console.log(`Error sending message to client with id '${client.id}': ${e.message}`);
                try { await client.websocket.close(); } catch { /* Ignore broken pipe error */ }
              }
            });

            channel.refreshClients();
          }
        }
      })();
    }

    console.log(`New client listening to channel ${channelName}`);
  }
}

export default ChannelManager;
