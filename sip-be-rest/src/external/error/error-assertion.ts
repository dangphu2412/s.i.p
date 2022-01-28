import { BadRequestException } from '@nestjs/common';

export class Assert {
  public static isTrue(condition: boolean, consumer?: () => Error): void {
    if (condition) {
      if (consumer) {
        throw consumer();
      } else {
        throw new BadRequestException();
      }
    }
  }

  public static isFalse(condition: boolean, consumer?: () => Error): void {
    Assert.isTrue(!condition, consumer);
  }
}
