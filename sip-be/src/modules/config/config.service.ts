export class ConfigService {
  static get(key: string): string {
    if (!process.env[key]) {
      throw new Error(`Can not get ${key} from process env`);
    }
    return process.env[key];
  }
}
