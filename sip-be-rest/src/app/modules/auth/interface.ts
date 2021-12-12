import { ProfileDto } from './dto/profile.dto';

export interface LoginSuccessResponse {
  accessToken: string;
  profile: ProfileDto;
}
