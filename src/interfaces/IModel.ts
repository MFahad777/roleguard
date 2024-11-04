export interface IRole extends Document {
    name: string;
    permissions: string[];
}

export interface IUser extends Document {
    roles: string[]
    [key : string] : any
}