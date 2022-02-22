import { ValidatorHandler } from './validator-handler';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [ValidatorHandler],
  exports: [ValidatorHandler],
})
export class ValidatorModule {}
