import { ConfigService } from '@external/config/config.service';
import { toOrders } from '@external/crud/common/pipes/order.pipe';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { ArrayMapper } from '@external/mappers/array.mapper';
import { ArrayUtils } from '@external/utils/array/array.utils';
import { Optional } from '@external/utils/optional/optional.util';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionService } from '@permission/permission.service';
import { SlugUtils } from '@utils/slug';
import { isEqual, pick } from 'lodash';
import { Profile } from 'src/auth/client/login-success';
import { GoogleUserExtractedDto } from 'src/auth/internal/google-user-extracted';
import { BcryptService } from 'src/auth/services/bcrypt.service';
import { ILike, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GrantPermissionDto } from './dto/grant-permission.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private logger: Logger;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly permissionService: PermissionService,
    private readonly bcryptService: BcryptService,
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
    newUser.headline = '';

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
      headline: '',
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

  public findByHashTag(hashTags: string[]) {
    return this.userRepository.find({
      where: {
        hashTag: In(hashTags),
      },
    });
  }

  public findDetail(hashTag: string) {
    return this.userRepository.findOne({
      where: {
        hashTag,
      },
      relations: ['followedTopics'],
    });
  }

  public async findById(id: number) {
    return this.userRepository.findOne(id);
  }

  public async findRequiredUserById(id: number) {
    return Optional(await this.userRepository.findOne(id)).orElseThrow(
      () =>
        new NotFoundException(
          `User is now not available in the system. Please contact system owner`,
        ),
    );
  }

  public findByIdWithFollowedTopics(id: number) {
    return this.userRepository.findOne(id, {
      relations: ['followedTopics'],
    });
  }

  public async findByIdWithFollowedIdeas(id: number) {
    return this.userRepository.findOne(id, {
      relations: ['followedIdeas'],
    });
  }

  public findByIds(ids: string[]) {
    return this.userRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  public async updateProfile(userId: number, profile: UpdateProfileDto) {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new UnprocessableEntityException('User is no longer available');
    }

    user.avatar = profile.avatar;
    user.headline = profile.headline;
    user.fullName = profile.fullName;
    return this.userRepository.save(user);
  }

  public save(user: User) {
    return this.userRepository.save(user);
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

  public splitAuthorAndUsers(
    authorId: string,
    users: User[],
  ): [User | null, User[]] {
    if (!authorId) {
      return [null, users];
    }

    if (users.length === 1 && users[0].id === authorId) {
      return [users[0], users];
    }

    return users.reduce(
      (result, user) => {
        if (user.id === authorId) {
          result[0] = user;
        } else {
          result[1].push(user);
        }
        return result;
      },
      [null, []],
    );
  }
}
