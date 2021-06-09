import { serve } from 'https://deno.land/std/http/server.ts';
import { acceptWebSocket, acceptable } from 'https://deno.land/std/ws/mod.ts';
import { connect } from 'https://deno.land/x/redis@v0.22.1/mod.ts';

import ChannelManager from './app/helper/ChannelManager.ts';

import { APP_PORT, REDIS_HOSTNAME, REDIS_PORT } from './app/config/app.ts';


const redis = await connect({
  hostname: REDIS_HOSTNAME,
  port: REDIS_PORT
});

const channelManager = new ChannelManager(redis);

const server = serve({ port: APP_PORT }); // TODO: implement wss
console.log(`WS API open on ws://localhost:${APP_PORT}`);

for await (const req of server) {
  const matchUrl = req.url.match('/trade/([a-z0-9]+:[a-z0-9]+)');

  if (matchUrl && acceptable(req)) {
    const webSocket = await acceptWebSocket({
      conn: req.conn,
      bufReader: req.r,
      bufWriter: req.w,
      headers: req.headers,
    });
    channelManager.addToChannel(`trade:${matchUrl[1]}`, webSocket);
  }
}
