import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDiscussionDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  public content: string;
}
