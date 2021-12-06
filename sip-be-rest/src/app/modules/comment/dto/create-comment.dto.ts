import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  public content: string;

  @ApiProperty()
  @IsNumber()
  public postId: number;

  public authorId: number;
}
