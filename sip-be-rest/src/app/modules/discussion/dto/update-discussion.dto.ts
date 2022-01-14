import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class UpdateDiscussionDto {
  @ApiProperty()
  @IsString()
  public content: string;

  @ApiProperty()
  @IsNumber()
  public postId: number;

  public authorId: number;
}
