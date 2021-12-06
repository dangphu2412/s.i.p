import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  public content: string;

  @ApiProperty()
  @IsNumber()
  public postId: number;

  public authorId: number;
}
