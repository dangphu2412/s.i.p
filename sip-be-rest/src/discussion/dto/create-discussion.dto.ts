import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateDiscussionDto {
  @ApiProperty()
  @IsString()
  public content: string;
}
