import slugify from 'slugify';
import { v4 } from 'uuid';

export class SlugUtils {
  public static normalize(input: string): string {
    return slugify(input);
  }

  public static normalizeLang(input: string, lang = 'en'): string {
    return slugify(input, {
      locale: lang,
    });
  }

  public static normalizeWithTimestamp(input: string): string {
    return slugify(input) + Date.now();
  }

  public static normalizeWithUUID(input: string): string {
    return slugify(input) + v4();
  }
}
