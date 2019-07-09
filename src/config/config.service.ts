import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {

  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  get jwtKey(): string {
    return this.get('JWT_SECRET');
  }

  get jwtExpiresTime(): number {
    return +this.get('JWT_EXPIRES');
  }
}
