import { EditablePostView } from './../client/post-editable';
import { Mapper } from '@external/mappers/mapper.interface';
import { PostOverview } from '@post/client/post-overview.api';
import { PostStatus, ProductRunningStatus } from '@post/enums/post-status.enum';

export function ScopeMapper(): Mapper<PostOverview, EditablePostView> {
  return {
    map(posts) {
      return posts.map((post) => {
        const canModify =
          post.status === PostStatus.DRAFT ||
          (post.status === PostStatus.PUBLISH &&
            post.runningStatus !== ProductRunningStatus.RELEASED);
        return {
          id: post.id,
          slug: post.slug,
          status: post.status,
          thumbnail: post.thumbnail,
          title: post.title,
          updatedAt: post.updatedAt,
          canDelete: canModify,
          canUpdate: canModify,
          readonly: !canModify,
        };
      });
    },
  };
}
