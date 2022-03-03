import { AccessRights } from '@constants/access-rights.enum';
import { IterateFactory } from '@database/utils/iterate-factory';
import { MediaService } from '@media/media.service';
import { Permission } from '@permission/permission.entity';
import {
  PostStatus,
  PricingType,
  ProductRunningStatus,
} from '@post/enums/post-status.enum';
import { Post } from '@post/post.entity';
import { Topic } from '@topic/topic.entity';
import { User } from '@user/user.entity';
import { Vote } from '@vote/entities/vote.entity';
import { random } from 'faker';
import { keyBy } from 'lodash';
import { In, MigrationInterface, QueryRunner } from 'typeorm';
import * as samplePosts from '../data/posts/index.json';
import * as sampleTopics from '../data/topics/index.json';
import { UrlProvider } from './../../../url/url.provider';
import { SlugUtils } from './../../utils/slug';

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
    const MAX_VOTE = 30;

    const postRepository = queryRunner.connection.getRepository(Post);
    const userRepository = queryRunner.connection.getRepository(User);
    const voteRepository = queryRunner.connection.getRepository(Vote);
    const mediaService = new MediaService(null, null, new UrlProvider());

    const commonPermissions = await this.getCommonPermissions(queryRunner);
    const userKeyByName: Map<string, User> = new Map();
    for (let i = 0; i < 30; i++) {
      const user = IterateFactory.createUser(i, commonPermissions);
      userKeyByName.set(user.fullName, user);
    }

    /**
     * - Create topics first (/)
     * - Initial post entities (/)
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
    topics = await queryRunner.connection.getRepository(Topic).save(topics);

    let posts: Post[] = [];
    const votes: Vote[] = [];

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
        if (!userKeyByName.has(maker.name)) {
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
          userKeyByName.set(user.fullName, user);
        }
        return userKeyByName.get(maker.name);
      });

      if (node.votesCount > MAX_VOTE) {
        node.votesCount = MAX_VOTE;
      }

      for (let i = 0; i < node.votesCount; i++) {
        const vote = new Vote();
        vote.post = post;
        vote.isVoted = true;
        votes.push(vote);
      }

      posts.push(post);
    });
    let users = Array.from(userKeyByName.values());

    users = await userRepository.save(users, {
      chunk: 10,
    });

    users.forEach((user) => {
      userKeyByName.set(user.fullName, user);
    });

    posts.forEach((post) => {
      post.makers = post.makers.map((user) => userKeyByName.get(user.fullName));
      post.author = post.makers[0];
      post.topics = [random.arrayElement(topics)];
    });
    const voteKeyByUniquePair: Map<string, Vote> = new Map();

    posts = await postRepository.save(posts);
    const postKeyByTitle = keyBy(posts, 'title');
    votes.forEach((vote) => {
      const author = random.arrayElement(users);
      vote.post = postKeyByTitle[vote.post.title];
      vote.author = author;
      voteKeyByUniquePair.set(`${vote.post.id}-${author.id}`, vote);
    });
    await voteRepository.save(Array.from(voteKeyByUniquePair.values()), {
      chunk: 20,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
