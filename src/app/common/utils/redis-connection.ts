import { Redis as RedisClient } from "ioredis";
import { env } from "../../../db/env.js";


function createRedisConnection() {
  // return new RedisClient({
  //   host: env.REDIS_HOST,
  //   port: env.REDIS_PORT,
  // });

  return new RedisClient(env.REDIS_URL)
}

export const redis = createRedisConnection();
export const publisher = createRedisConnection();
export const subscriber = createRedisConnection();
