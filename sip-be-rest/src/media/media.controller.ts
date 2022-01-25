import { ConfigService } from '@external/config/config.service';
import { toData } from '@external/crud/extensions/data-wrapper';
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MediaService } from './media.service';

@ApiTags('media')
@Controller('v1/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', +ConfigService.getCache('UPLOAD_MAX_COUNT')),
  )
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const urls = await this.mediaService.uploadImages(files);
    return toData(urls);
  }
}
