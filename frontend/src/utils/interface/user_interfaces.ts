export interface IProfile {
    first_name: string;
    last_name: string;
    phone: string;
    adress: string;
    url_photo: string;
    }

export interface IUser extends IProfile {
    id: string;
    username: string;
    email: string;
    disabled: boolean;
    is_verifier: boolean;
    role: string;
    is_verified?: boolean;
    }

export interface IWorker {
    id: string;
    user: IUser;
}
export interface IClient {
    id: string;
    user: IUser;
}