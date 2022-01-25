import { GalleryDto } from '@media/dto/gallery.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  ValidateNested,
} from 'class-validator';
import { ProductLinkDto } from './product-link.dto';

export class UpdatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(40)
  public title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public content: string;

  @ApiProperty()
  @Max(260)
  @IsNotEmpty()
  @IsString()
  public summary: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  public gallery: GalleryDto;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  public productLink: ProductLinkDto;

  @ApiProperty()
  @IsArray({
    each: true,
  })
  public topicIds: string[];

  @ApiProperty()
  public siper: string;

  @ApiProperty()
  @IsArray({
    each: true,
  })
  public makers: string[];

  @ApiProperty()
  @IsDate()
  public launchSchedule: Date;
}
