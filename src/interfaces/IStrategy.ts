import { TRole } from "../types/TRole";
import { MongoClient, Db, InferIdType, ObjectId } from "mongodb";

export interface IStrategy {
    addRole(role: TRole): Promise<void>;
    removeRole(roleName: string): Promise<void>;
    assignPermission(roleName: string, permission: string): Promise<void>;
    hasPermission(roleName: string, permission: string): Promise<boolean>;

    assignRoleToUser(userId: InferIdType<ObjectId | string>, roleName: string): Promise<void>;
    checkUserPermission(userId: InferIdType<ObjectId | string>, permission: string): Promise<boolean>;
}