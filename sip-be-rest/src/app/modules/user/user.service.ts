import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { pick } from 'lodash';
import { ProfileDto } from '../auth/dto/profile.dto';
import { GrantPermissionDto } from './dto/grant-permission.dto';
import { PermissionService } from '@modules/permission/permission.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '@modules/auth/services/bcrypt.service';
import { ConfigService } from '@external/config/config.service';
import { ArrayUtils } from '@external/utils/array/array.utils';
import { ErrorAssertion } from '@modules/error/error-assertion';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { toOrders } from '@external/crud/common/pipes/order.pipe';
import { TokenPayload } from 'google-auth-library';

@Injectable()
export class UserService {
  private logger: Logger;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private permissionService: PermissionService,
    private bcryptService: BcryptService,
  ) {
    this.logger = new Logger(UserService.name);
  }

  public async createOne(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (user) {
      throw new UnprocessableEntityException(
        'Your username or email is duplicated',
      );
    }

    return this.createUser(createUserDto);
  }

  public async createByGooglePayload(payload: TokenPayload) {
    return this.createUser({
      email: payload.email,
      fullName: payload.name,
      avatar: payload.picture,
    });
  }

  private async createUser(partialUser: Partial<User>) {
    const userEntity = User.create(partialUser);

    userEntity.password = await this.bcryptService.hash(userEntity.password);
    userEntity.avatar =
      userEntity.avatar || ConfigService.getCache('DEFAULT_AVATAR');

    try {
      return await this.userRepository.save(userEntity);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error while handling insert new user',
      );
    }
  }

  public findAll(searchQuery: SearchCriteria) {
    return this.userRepository.findAndCount({
      order: toOrders(searchQuery.sorts),
    });
  }

  public findByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['permissions'],
    });
  }

  public findById(id: number) {
    return this.userRepository.findOne(id);
  }

  public getBasicProfile(user: User): ProfileDto {
    return pick(user, ['id', 'username', 'fullName', 'avatar']) as ProfileDto;
  }

  public async grantPermissionForUser(
    userId: string,
    grantPermissionDto: GrantPermissionDto,
  ) {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(
        `Not found any user to grant permissions with id: ${userId}`,
      );
    }

    const permissions = await this.permissionService.findByIds(
      grantPermissionDto.permissionIds,
    );

    if (ArrayUtils.isEmpty(permissions)) {
      throw new NotFoundException('No permissions found to grant for user');
    }

    ErrorAssertion.assertKeysNotDiff(
      permissions,
      grantPermissionDto.permissionIds,
    );

    user.permissions = permissions;
    await this.userRepository.save(user);
  }
}
