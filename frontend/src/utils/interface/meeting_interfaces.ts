export interface IProfile {
    first_name: string;
    last_name: string;
    username: string;
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
    is_admin: boolean;
    }

export interface IWorker {
    id: string;
    user: IUser;
}