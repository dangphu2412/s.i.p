import { ConfigService } from '@external/config/config.service';
import { toOrders } from '@external/crud/common/pipes/order.pipe';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { ArrayUtils } from '@external/utils/array/array.utils';
import { Profile } from 'src/auth/client/login-success';
import { BcryptService } from 'src/auth/services/bcrypt.service';
import { GoogleUserExtractedDto } from 'src/auth/internal/google-user-extracted';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SlugUtils } from '@utils/slug';
import { isEqual, pick } from 'lodash';
import { In, Repository, ILike } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GrantPermissionDto } from './dto/grant-permission.dto';
import { User } from './user.entity';
import { PermissionService } from '@permission/permission.service';
import { ArrayMapper } from '@external/mappers/array.mapper';

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

    const newUser = User.create(createUserDto);
    newUser.hashTag = createUserDto.username;
    newUser.password = await this.bcryptService.hash(newUser.password);
    newUser.avatar = newUser.avatar || ConfigService.getCache('DEFAULT_AVATAR');

    return this.createUser(newUser);
  }

  public async createByGooglePayload(payload: GoogleUserExtractedDto) {
    const fullName = `${payload.firstName} ${payload.lastName}`;
    const newUser = User.create({
      username: SlugUtils.normalize(fullName),
      hashTag: payload.email,
      email: payload.email,
      fullName,
      avatar: payload.picture,
      password: '',
    });
    return this.createUser(newUser);
  }

  private async createUser(user: User) {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error while handling insert new user',
      );
    }
  }

  public findMany(searchQuery: SearchCriteria) {
    return this.userRepository.findAndCount({
      order: toOrders(searchQuery.sorts),
    });
  }

  public findMakers(searchQuery: SearchCriteria) {
    const searchOperator = ILike(`%${searchQuery.search}%`);
    return this.userRepository.find({
      where: [
        {
          fullName: searchOperator,
        },
        {
          email: searchOperator,
        },
      ],
      skip: searchQuery.offset,
      take: searchQuery.limit,
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

  public findByIds(ids: string[]) {
    return this.userRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  public extractProfile(user: User): Profile {
    return pick(user, ['id', 'username', 'fullName', 'avatar']) as Profile;
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

    const oldPermissionIds = ArrayMapper.mapByKey(permissions, 'id');

    if (!isEqual(oldPermissionIds, grantPermissionDto.permissionIds)) {
      throw new UnprocessableEntityException(
        `Invalid permissionIds: ${grantPermissionDto.permissionIds.toString()}`,
      );
    }

    user.permissions = permissions;
    await this.userRepository.save(user);
  }
}
