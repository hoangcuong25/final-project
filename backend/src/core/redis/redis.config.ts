import { ConfigService } from "@nestjs/config";
import { RedisModuleOptions } from "@nestjs-modules/ioredis";

export const redisConfig = async (
  configService: ConfigService
): Promise<RedisModuleOptions> => ({
  type: "single",
  url: configService.get<string>("UPSTASH_REDIS_URL") || "",
});
