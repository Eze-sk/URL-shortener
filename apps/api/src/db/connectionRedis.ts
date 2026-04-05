import { createClient } from "redis";
import { logInternalError } from "@model/logInternalError";
import { PASSWORD_REDIS, HOST_REDIS, PORT_REDIS } from "@consts/config";

export const redisClient = createClient({
  username: 'default',
  password: PASSWORD_REDIS,
  socket: {
    host: HOST_REDIS,
    port: PORT_REDIS
  }
});

redisClient.on("error", async (err) => {
  await logInternalError.create({ err, context: "REDIS_CLIENT_ERROR" })
})

export async function connectionRedis() {
  await redisClient.connect();
  console.log('Conectado a Redis Cloud');
}