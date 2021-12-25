import { Module } from '@nestjs/common';
import { UrlProvider } from './url.provider';

@Module({
  imports: [],
  providers: [UrlProvider],
  exports: [UrlProvider],
})
export class UrlModule {}
