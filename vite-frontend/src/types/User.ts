import { AccountType } from "@/services/Paths";

export interface IUser {
    role: AccountType;
    nickname: string;
    accessToken: string;
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