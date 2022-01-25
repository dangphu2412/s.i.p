import {
  BadGatewayException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { CloudinaryProvider } from './providers/cloudinary.provider';
import { unlink } from 'fs/promises';
import { toSecuredUrls } from './mapper/media.mapper';
@Injectable()
export class MediaService {
  constructor(
    private cloudinaryProvider: CloudinaryProvider,
    private logger: Logger,
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
