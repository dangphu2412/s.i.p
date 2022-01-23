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
