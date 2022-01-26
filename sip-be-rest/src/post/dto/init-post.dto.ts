import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class InitPostDto {
  @ApiProperty()
  @MaxLength(40)
  public title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public productLink?: string;
}
