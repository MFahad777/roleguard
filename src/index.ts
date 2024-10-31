import { IStrategy } from "./interfaces/IStrategy"
import { TRole } from "./types/TRole"
import {DeleteResult, InferIdType, InsertOneResult, ObjectId, UpdateResult} from "mongodb";

class AuthRealm {
    private strategy: IStrategy;

    use(strategy: IStrategy): void {
        if (!strategy) {
            throw new Error('No strategy has been set. Please use a strategy first.');
        }
        this.strategy = strategy;
    }

    // Proxy methods to RoleManager and PermissionManager
    async addRole(role: TRole): Promise<InsertOneResult<Document>> {
        return this.strategy.addRole(role);
    }

    async removeRole(roleNameOrId: InferIdType<ObjectId | string>) : Promise<DeleteResult> {
        return this.strategy.removeRole(roleNameOrId);
    }

    async assignPermission(roleNameOrId: InferIdType<ObjectId | string>, permission: string): Promise<UpdateResult<Document>> {
        return this.strategy.assignPermission(roleNameOrId, permission);
    }

    async hasPermission(roleNameOrId: InferIdType<ObjectId | string>, permission: string): Promise<boolean> {
        return this.strategy.hasPermission(roleNameOrId, permission);
    }

    async assignRoleToUser(userId: InferIdType<ObjectId | string>, roleName: string): Promise<UpdateResult<Document>> {
        return this.strategy.assignRoleToUser(userId, roleName);
    }

    async checkUserPermission(userId: InferIdType<ObjectId | string>, permission: string): Promise<boolean> {
        return this.strategy.checkUserPermission(userId, permission);
    }
}

export = AuthRealm;