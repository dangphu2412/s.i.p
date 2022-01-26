import { SocialMediaDto } from '@media/dto/gallery.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  PostStatus,
  PricingType,
  ProductRunningStatus,
} from '@post/enums/post-status.enum';
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
  @IsOptional()
  @IsString()
  public description: string;

  @ApiProperty()
  @Max(260)
  @IsNotEmpty()
  @IsString()
  public summary: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  public gallery: SocialMediaDto;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  public links: ProductLinkDto;

  @ApiProperty()
  @IsArray({
    each: true,
  })
  public topicIds: string[];

  @ApiProperty()
  public isAuthorAlsoMaker: boolean;

  @ApiProperty()
  @IsArray({
    each: true,
  })
  public makerIds: string[];

  @ApiProperty()
  @IsDate()
  public launchSchedule: Date;

  @ApiProperty()
  public status: PostStatus;

  @ApiProperty()
  public runningStatus: ProductRunningStatus;

  @ApiProperty()
  public pricingType: PricingType;
}
