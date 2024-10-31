import { TRole } from "../types/TRole";
import {InferIdType, ObjectId, InsertOneResult, DeleteResult, UpdateResult} from "mongodb";

export interface IStrategy {
    addRole(role: TRole): Promise<InsertOneResult<Document>>;
    removeRole(roleNameOrId: InferIdType<ObjectId | string>): Promise<DeleteResult>;
    assignPermission(roleNameOrId: InferIdType<ObjectId | string>, permission: string): Promise<UpdateResult<Document>>;
    hasPermission(roleNameOrId: InferIdType<ObjectId | string>, permission: string): Promise<boolean>;

    assignRoleToUser(userId: InferIdType<ObjectId | string>, roleName: string): Promise<UpdateResult<Document>>;
    checkUserPermission(userId: InferIdType<ObjectId | string>, permission: string): Promise<boolean>;
}