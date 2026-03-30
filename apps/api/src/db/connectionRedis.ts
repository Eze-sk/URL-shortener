import { PASSWORD_REDIS, HOST_REDIS, PORT_REDIS } from "@/consts/config"
import { logInternalError } from "@model/logInternalError"
import { createClient } from "redis"

export const redisClient = createClient({
  username: 'default',
  password: PASSWORD_REDIS,
  socket: {
    host: HOST_REDIS,
    port: PORT_REDIS
  }
});

redisClient.on("error", err => {
  console.error('Redis Client Error:', err)
})

export async function connectionRedis() {
  await redisClient.connect();
  console.log('Conectado a Redis Cloud');
}