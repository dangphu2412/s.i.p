import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Max } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @Length(40)
  public title: string;

  @ApiProperty()
  @IsString()
  public content: string;

  @ApiProperty()
  @Max(260)
  @IsString()
  public summary: string;

  @ApiProperty()
  @IsString()
  public thumbnail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public videoDemo?: string;

  @ApiProperty()
  public galleryImages: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  public productLink: string;
}
