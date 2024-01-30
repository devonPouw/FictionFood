import { AccountType } from "@/services/Paths";

export interface IUser {
    sub: string,
    role: AccountType,
    nickname: string,
    iat: number,
    exp: number,
}
export interface IRegisterData {
    role: string;
    nickname: string;
    username: string;
    email: string;
    password: string;
}
export interface ILoginData {
    username: string,
    password: string,
}