import { ProductRunningStatus, PricingType, PostStatus } from './../constants/post-status.enum';
import { Topic } from '../../topic/api/topic.api';
import { Author } from '../../user/api/user.api';

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  isAuthor: boolean;
  totalVotes: string;
  topics: Topic[];
  author: Author;
}

export type PostOverview = PostSummary[];

export interface PostDetail {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;

  productLink: string;
  facebookLink: string;
  videoLink: string;
  thumbnail: string;
  socialPreviewImage: string;
  galleryImages: string[];
  pricingType: PricingType;

  isVoted: boolean;
  totalVotes: number;

  makers: Author[];
  topics: Topic[];
  author: Author;

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
    launchSchedule: Date;
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