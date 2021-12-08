import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  public title: string;

  @ApiProperty()
  public content: string;
}
