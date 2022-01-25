import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProductLinkDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public productLink: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public videoLink: string;
}
