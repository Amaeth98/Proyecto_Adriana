import { ConfigService } from '@nestjs/config';

export function getRequiredConfig(
  config: ConfigService,
  key: string,
  fallback?: string,
) {
  const value = config.get<string>(key);
  if (value) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${key} is required in production`);
  }
  return fallback;
}
