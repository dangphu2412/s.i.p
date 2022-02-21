import { YOUTUBE_VIDEO_ID_MATCHER } from './constants/index';
import { ArrayUtils } from './../external/utils/array/array.utils';
import {
  BadGatewayException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { CloudinaryProvider } from './providers/cloudinary.provider';
import { unlink } from 'fs/promises';
import { toSecuredUrls } from './mapper/media.mapper';
import { UrlProvider } from '@url/url.provider';
@Injectable()
export class MediaService {
  constructor(
    private cloudinaryProvider: CloudinaryProvider,
    private logger: Logger,
    private readonly urlProvider: UrlProvider,
  ) {}

  public async uploadImages(files: Array<Express.Multer.File>) {
    const uploadProcess = this.getUploadProcess(files);

    let uploadedResults: UploadApiResponse[];
    try {
      uploadedResults = await uploadProcess;
    } catch (error) {
      this.logger.error(error, MediaService.name);
      await this.handleUploadErrorProcess(error);
    } finally {
      await this.cleanupProcess(files);
    }

    return toSecuredUrls(uploadedResults);
  }

  public getYoutubeThumbnail(url: string) {
    const urlItems = url.match(YOUTUBE_VIDEO_ID_MATCHER);
    if (!ArrayUtils.has(2, urlItems)) {
      throw new UnprocessableEntityException(
        'Cannot find youtube video id in url',
      );
    }
    return this.urlProvider.getYoutubeThumbnailUrl(urlItems[1]);
  }

  private getUploadProcess(files: Array<Express.Multer.File>) {
    return Promise.all(
      files.map((file) => {
        return this.cloudinaryProvider.uploadByFilePath(file.path);
      }),
    );
  }

  private cleanupProcess(files: Array<Express.Multer.File>) {
    return Promise.all(
      files.map((file) => {
        return unlink(file.path);
      }),
    );
  }

  private async handleUploadErrorProcess(error) {
    if (error.http_code === HttpStatus.UNAUTHORIZED) {
      throw new InternalServerErrorException(
        'Server got wrong config cloudinary',
      );
    } else {
      throw new BadGatewayException(
        'Upload process failed due to cloudinary provider got problem',
      );
    }
  }
}
