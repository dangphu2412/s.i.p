import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  public fullName: string;

  @ApiProperty()
  @IsString()
  public headline: string;

  @Exclude()
  public avatar: string;
}
