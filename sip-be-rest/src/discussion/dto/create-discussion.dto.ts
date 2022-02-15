import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDiscussionDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public content: string;
}
