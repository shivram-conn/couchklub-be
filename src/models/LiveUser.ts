export interface LiveUser {
    id: string;
    name: string;
    email: string;
    token: string;
    loginAt: Date;
    metadata: any;
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface LogoutUser {
    id: string;
}