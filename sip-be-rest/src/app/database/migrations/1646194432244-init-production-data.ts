import { UrlProvider } from './../../../url/url.provider';
import { SlugUtils } from './../../utils/slug';
import { Comment } from '@comment/entities/comment.entity';
import { Post } from '@post/post.entity';
import { Topic } from '@topic/topic.entity';
import { User } from '@user/user.entity';
import { Vote } from '@vote/entities/vote.entity';
import { In, MigrationInterface, QueryRunner } from 'typeorm';
import * as samplePosts from '../data/posts/index.json';
import * as sampleTopics from '../data/topics/index.json';
import * as sampleComments from '../data/comments/index.json';
import { IterateFactory } from '@database/utils/iterate-factory';
import { Permission } from '@permission/permission.entity';
import { AccessRights } from '@constants/access-rights.enum';
import { MediaService } from '@media/media.service';
import {
  PostStatus,
  PricingType,
  ProductRunningStatus,
} from '@post/enums/post-status.enum';

export class initProductionData1646194432244 implements MigrationInterface {
  private notAdmin(access: keyof typeof AccessRights.RootAccess): boolean {
    return access !== AccessRights.RootAccess.ADMIN;
  }

  private async getCommonPermissions(queryRunner: QueryRunner) {
    return queryRunner.connection.getRepository(Permission).find({
      where: {
        name: In(Object.values(AccessRights.RootAccess).filter(this.notAdmin)),
      },
    });
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const postRepository = queryRunner.connection.getRepository(Post);
    const topicRepository = queryRunner.connection.getRepository(Topic);
    const userRepository = queryRunner.connection.getRepository(User);
    const commentRepository = queryRunner.connection.getRepository(Comment);
    const voteRepository = queryRunner.connection.getRepository(Vote);
    const mediaService = new MediaService(null, null, new UrlProvider());

    const commonPermissions = await this.getCommonPermissions(queryRunner);
    const users: Map<string, User> = new Map();
    for (let i = 0; i < 30; i++) {
      const user = IterateFactory.createUser(i, commonPermissions);
      users.set(user.fullName, user);
    }

    /**
     * - Create topics first (/)
     * - Initial post entities
     * - Insert makers to  database if exist or not (/)
     * - See the voteCount of post
     *  -> Check if it reach max: if yes, set it to max 30
     *  -> Next random user to vote it up to reach vote count
     */

    let topics: Topic[] = sampleTopics.data.topics.edges.map(({ node }) => {
      const topic = new Topic();
      topic.name = node.name;
      topic.summary = node.description;
      topic.slug = node.slug;
      topic.avatar = node.image;
      topic.createdAt = new Date(node.createdAt);
      return topic;
    });
    await queryRunner.connection.getRepository(Topic).insert(topics);
    topics = undefined; // RELEASE THE OBJECT

    const posts: Post[] = [];

    samplePosts.data.posts.edges.forEach(({ node }) => {
      const post = new Post();
      post.title = node.name;
      post.summary = node.tagline;
      post.slug = node.slug || SlugUtils.normalize(node.name);
      post.description = node.description;
      post.productLink = `/posts/${post.slug}`;
      post.facebookLink = '';
      post.isAuthorAlsoMaker = true;
      post.pricingType = PricingType.FREE;
      post.runningStatus = ProductRunningStatus.RELEASED;
      post.status = PostStatus.PUBLISH;

      post.createdAt = new Date(node.createdAt);
      post.galleryImages = node.media
        .filter((item) => item.type !== 'video')
        .map((item) => item.url);

      post.socialPreviewImage = post.galleryImages[0];
      post.thumbnail = node.thumbnail.url;
      post.createdAt = new Date(node.createdAt);
      post.videoLink =
        node.media.find((item) => item.type === 'video')?.videoUrl || '';
      post.videoThumbnail = post.videoLink
        ? mediaService.getYoutubeThumbnail(post.videoLink)
        : '';

      post.makers = node.makers.map((maker) => {
        if (!users.has(maker.name)) {
          const slug = SlugUtils.normalize(maker.name);
          const user = new User();
          user.fullName = maker.name;
          user.email = `${maker.name}@gmail.com`;
          user.hashTag = slug;
          user.username = slug;
          user.avatar = maker.profileImage;
          user.headline = maker.headline || '';
          user.permissions = commonPermissions;
          user.password = '';
          users.set(user.fullName, user);
        }
        return users.get(maker.name);
      });
      posts.push(post);
    });
    const newUsers = await userRepository.save(Array.from(users.values()));

    newUsers.forEach((user) => {
      users.set(user.fullName, user);
    });

    posts.forEach((post) => {
      post.makers = post.makers.map((user) => users.get(user.fullName));
      post.author = post.makers[0];
    });

    await postRepository.save(posts);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
