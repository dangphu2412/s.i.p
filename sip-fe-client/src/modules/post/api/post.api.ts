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
  content: string;
  summary: string;
  thumbnail: string;
  previewGalleryImg: string;
  galleryImages: string[];
  videoDemo: string;
  productLink: string;
  isVoted: boolean;
  totalVotes: number;
  topics: Topic[];
  author: Author;

  ranking: string;
}

export interface ProjectMember {
  id: string,
  avatar: string,
  name: string,
  position: string
}

export interface ProjectMembers {
  hunter: ProjectMember,
  makers: ProjectMember[]
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
    status: string;
    runningStatus: string;
    pricingType: string;
    launchSchedule: Date;
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