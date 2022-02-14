import { PostStatus } from '@post/enums/post-status.enum';

export interface EditablePost {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  thumbnail: string;
  updatedAt: Date;
  canDelete: boolean;
  canUpdate: boolean;
  readonly: boolean;
}

export type EditablePostView = EditablePost[];
