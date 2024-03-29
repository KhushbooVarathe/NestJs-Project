import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis(); // Connect to default Redis server (localhost:6379)
    // You can also pass options to the Redis constructor for custom configuration
  }

  
  async setToken(key: string, token: string): Promise<void> {
    await this.client.set(key, token);
  }

  async getToken(key: string): Promise<string | null> {
    return this.client.get(key);
  }
  async deleteToken(key: string): Promise<number> {
    // Delete the key from Redis and return the number of keys that were removed
    return this.client.del(key);
  }
  async searchKey(key:string):Promise<any>{
    return this.client.exists(key);
  }
}
