/* eslint-disable @typescript-eslint/no-empty-function */
import { Comment } from '@comment/entities/comment.entity';
import { Post } from '@post/post.entity';
import { User } from '@user/user.entity';
import { random } from 'faker';
import { keyBy } from 'lodash';
import { In, MigrationInterface, Not, QueryRunner } from 'typeorm';
import * as sampleComments from '../data/comments/index.json';

export class initCommentInProd1646227157642 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.connection.getRepository(User).find({
      where: {
        fullName: Not('admin'),
      },
      take: 30,
    });
    const postTitles = sampleComments.data.posts.edges.map(
      ({ node }) => node.name,
    );
    const posts = await queryRunner.connection.getRepository(Post).find({
      where: {
        title: In(postTitles),
      },
    });
    const postKeyByTitle = keyBy(posts, 'title');
    const commentKyByUniqueKeyPair = new Map<string, Comment>();
    sampleComments.data.posts.edges.forEach(({ node }) => {
      const post = postKeyByTitle[node.name];
      if (post) {
        node.comments.edges.forEach((comment) => {
          const commentEntity = new Comment();
          const author = random.arrayElement(users);
          commentEntity.content = comment.node.body;
          commentEntity.post = post;
          commentEntity.createdAt = new Date(comment.node.createdAt);
          commentEntity.author = author;
          commentKyByUniqueKeyPair.set(
            `${post.id}-${author.id}`,
            commentEntity,
          );
        });
      }
    });

    await queryRunner.connection
      .getRepository(Comment)
      .save(Array.from(commentKyByUniqueKeyPair.values()), {
        chunk: 30,
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
