export interface IUser {
    role: string;
    nickname: string;
    username: string;
    email: string;
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