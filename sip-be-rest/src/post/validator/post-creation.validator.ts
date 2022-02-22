import { UpdatePostDto } from '@post/dto/update-post.dto';
import { Validator } from './../../../dist/src/validator/validator-handler.d';

export class PostCreationValidator implements Validator<UpdatePostDto> {
  accept(input: UpdatePostDto): boolean {
    throw new Error('Method not implemented.');
  }
}
