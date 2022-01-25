import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Max } from 'class-validator';

export class InitPostDto {
  @ApiProperty()
  @IsString()
  @Length(40)
  public title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public productLink?: string;
}
