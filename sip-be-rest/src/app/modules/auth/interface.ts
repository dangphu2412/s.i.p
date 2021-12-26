export interface LoginSuccessResponse {
  accessToken: string;
  profile: Profile;
}

export interface Profile {
  id: string;
  username: string;
  avatar: string;
  fullName: string;
}
