import {TRole} from "../types/TRole";
import {InferIdType, ObjectId, InsertOneResult, DeleteResult, UpdateResult} from "mongodb";
import { QueryWithHelpers } from "mongoose";

export interface IBaseStrategy {
    addRole(role: any): Promise<any>;

    removeRole(roleNameOrId: any): Promise<any>;

    assignPermission(roleNameOrId: any, permission: any): Promise<any>;

    hasPermission(roleNameOrId: any, permission: any): Promise<any>;

    assignRoleToUser(userId: any, roleName: any): Promise<any>;

    checkUserPermission(userId: any, permission: any): Promise<any>;
}

export interface IMongoDBStrategy extends IBaseStrategy {
    addRole(role: TRole): Promise<InsertOneResult<Document>>;

    removeRole(roleNameOrId: string): Promise<DeleteResult>;

    assignPermission(roleNameOrId: string, permission: string): Promise<UpdateResult<Document>>;

    hasPermission(roleNameOrId: string, permission: string): Promise<boolean>;

    assignRoleToUser(userId: string, roleName: string): Promise<UpdateResult<Document>>;

    checkUserPermission(userId: string, permission: string): Promise<boolean>;
}

export interface IMongooseStrategy extends IBaseStrategy {
    addRole(role: TRole): Promise<Document>;

    removeRole(roleNameOrId: string): Promise<QueryWithHelpers<DeleteResult, Document>>;

    assignPermission(roleNameOrId: string, permission: string): Promise<QueryWithHelpers<UpdateResult<Document>, Document>>;

    hasPermission(roleNameOrId: string, permission: string): Promise<boolean>;

    assignRoleToUser(userId: string, roleName: string): Promise<QueryWithHelpers<UpdateResult<Document>, Document>>;

    checkUserPermission(userId: string, permission: string): Promise<boolean>;
}