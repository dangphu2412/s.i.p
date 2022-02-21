import { Module, Logger } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express/multer';
import { MulterConfig } from './config/multer.config';
import { CloudinaryProvider } from './providers/cloudinary.provider';
import { UrlModule } from '@url/url.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfig,
    }),
    UrlModule,
  ],
  controllers: [MediaController],
  providers: [MediaService, CloudinaryProvider, Logger],
  exports: [MediaService],
})
export class MediaModule {}
