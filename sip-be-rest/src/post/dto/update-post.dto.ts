import { SocialMediaDto } from '@media/dto/gallery.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  PricingType,
  ProductRunningStatus,
} from '@post/enums/post-status.enum';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ProductLinkDto } from './product-link.dto';

export class UpdatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(0, 40)
  public title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(0, 260)
  public summary: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  public socialMedia: SocialMediaDto;

  @ApiProperty()
  @IsObject()
  @ValidateNested({ each: true })
  public links: ProductLinkDto;

  @ApiProperty()
  @IsArray()
  public topicIds: string[];

  @ApiProperty()
  public isAuthorAlsoMaker: boolean;

  @ApiProperty()
  @IsArray()
  public makerIds: string[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public isLookingForMakers: boolean;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  public launchSchedule: Date;

  @ApiProperty()
  @IsEnum(ProductRunningStatus)
  public runningStatus: ProductRunningStatus;

  @ApiProperty()
  @IsEnum(PricingType)
  public pricingType: PricingType;
}
