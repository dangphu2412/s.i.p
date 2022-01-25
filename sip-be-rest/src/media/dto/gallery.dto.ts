import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GalleryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public thumbnail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public videoDemo?: string;

  @ApiProperty()
  @IsArray({
    each: true,
  })
  @IsNotEmpty()
  public galleryImages: string[];
}
