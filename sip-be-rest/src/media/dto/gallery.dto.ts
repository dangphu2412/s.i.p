import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SocialMediaDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public videoLink?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public facebookLink?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public thumbnail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public socialPreviewImage: string;

  @ApiProperty()
  @IsArray({
    each: true,
  })
  @IsNotEmpty()
  public galleryImages: string[];
}
