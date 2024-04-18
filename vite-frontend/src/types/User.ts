export type AccountType = "MODERATOR" | "CHEF" | "VISITOR";

export const accountType: { [key in AccountType]: AccountType } = {
  MODERATOR: "MODERATOR",
  CHEF: "CHEF",
  VISITOR: "VISITOR",
};
export interface IUser {
  sub: string;
  role: AccountType;
  nickname: string;
  avatarId: number;
  iat: number;
  exp: number;
}
export interface IRegisterData {
  role: string;
  nickname: string;
  username: string;
  email: string;
  password: string;
}
export interface ILoginData {
  username: string;
  password: string;
}
export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmationPassword: string;
}
export interface IProfileData {
  nickname: string;
  email: string;
  role: AccountType;
  avatarId: number;
}
