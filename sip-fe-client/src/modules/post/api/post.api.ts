import { ProductRunningStatus, PricingType, PostStatus } from './../constants/post-status.enum';
import { Topic } from '../../topic/api/topic.api';
import { Author, User } from '../../user/api/user.api';

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  isVoted: boolean;
  totalVotes: string;
  totalReplies: string;
  thumbnail: string;
  topics: Topic[];
  author: Author;
}

export type IdeaSummary =  (Omit<PostSummary, 'isVoted'> & { isFollowed: boolean });

export type PostOverview = PostSummary[];

export type IdeaOverview = IdeaSummary[];

export interface PostDetail {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;

  productLink: string;
  facebookLink: string;
  videoLink: string;
  videoThumbnail: string;
  thumbnail: string;
  socialPreviewImage: string;
  galleryImages: string[];
  pricingType: PricingType;

  isVoted: boolean;
  totalVotes: number;

  makers: Author[];
  topics: Topic[];
  author: Author;
  followers: User[];

  ranking: string;
}

export interface PatchPostDetail {
    id: string;
    title: string;
    summary: string;
    description: string;
    productLink: string;
    facebookLink: string;
    topics: Topic[],
    makers: Author[];
    thumbnail: string;
    videoLink: string;
    socialPreviewImage: string;
    galleryImages: string[];
    isAuthorAlsoMaker: boolean;
    status: PostStatus;
    runningStatus: ProductRunningStatus;
    pricingType: PricingType;
    launchSchedule: Date | null;
    firstComment: string;
}

export interface UpdatePostDto extends PatchPostDetail {
  topicIds: string[];
  makerIds: string[];
  socialMedia: {
    videoLink: string;
    facebookLink: string;
    thumbnail: string;
    socialPreviewImage: string;
    galleryImages: string[];
  },
  links: {
    productLink: string;
  }
}

export interface EditPostViewDto {
    id: string;
    title: string;
    slug: string;
    status: PostStatus;
    thumbnail: string;
    updatedAt: string;
    canDelete: boolean;
    canUpdate: boolean;
    readonly: boolean;
}
