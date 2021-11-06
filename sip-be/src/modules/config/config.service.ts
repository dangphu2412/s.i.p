export class ConfigService {
  static get(key: string): string {
    if (!process.env[key]) {
      throw new Error();
    }
    return process.env[key];
  }
}
