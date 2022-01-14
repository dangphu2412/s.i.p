import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Max } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @Length(40)
  public title: string;

  @ApiProperty()
  public content: string;

  @ApiProperty()
  @Max(260)
  public summary: string;

  @ApiProperty()
  public thumbnail: string;

  @ApiProperty()
  public videoDemo: string;

  @ApiProperty()
  public galleryImages: string[];

  @ApiProperty()
  public productLink: string;
}
