import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayload } from 'google-auth-library';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id: ${id} is not found`);
    }
    return user;
  }

  public findByEmail(email: string) {
    return this.usersRepository.findOne({ email });
  }

  public createWithGoogleTokenPayload(payload: TokenPayload) {
    const user = new User();
    user.email = payload.email;
    user.avatar = payload.picture;
    user.name = payload.name;
    return this.usersRepository.save(user);
  }
}
