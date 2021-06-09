## About

Rawkit Broadcaster is a Redis PubSub channels broadcaster API implemented with WebSocket. It can handle multiple WebSockets connections at once.

## Recommended Versions

The application has been tested with Deno 1.10.3 and Redis 5.0.7.

## Prerequisites

* Have a Redis server running
* Configure Redis hostname and port on `app/config/app.ts`

## Running

```
deno run --allow-net ./main.ts
```

## WebSocket API

`/trade/{ticker}`

* `{ticker}` should be of the form `exchange:ticker` (e.g. `binance:ethbtc`)
* The application will subscribe to the channel `trade:{ticker}` (e.g. `trade:binance:ethbtc`) on Redis PubSub
* The application will route the messages received via SUBSCRIBE to the WebSocket connection
