export class ConfigService {
  static get(key: string): string {
    if (!process.env[key]) {
      throw new Error(`Can not get ${key} from process env`);
    }
    return process.env[key];
  }

  static getOptional(key: string): string | null {
    if (!process.env[key]) {
      return null;
    }
    return process.env[key];
  }

  static getInt(key: string) {
    return Number.parseInt(ConfigService.get(key), 10);
  }
}
