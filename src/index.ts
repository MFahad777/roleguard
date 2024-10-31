import { IStrategy } from "./interfaces/IStrategy"
import { TRole } from "./types/TRole"
import {InferIdType, ObjectId} from "mongodb";

class AuthRealm {
    private strategy: IStrategy;

    use(strategy: IStrategy): void {
        if (!strategy) {
            throw new Error('No strategy has been set. Please use a strategy first.');
        }
        this.strategy = strategy;
    }

    // Proxy methods to RoleManager and PermissionManager
    async addRole(role: TRole): Promise<void> {
        return this.strategy.addRole(role);
    }

    async removeRole(roleName: string): Promise<void> {
        return this.strategy.removeRole(roleName);
    }

    async assignPermission(roleName: string, permission: string): Promise<void> {
        return this.strategy.assignPermission(roleName, permission);
    }

    async hasPermission(roleName: string, permission: string): Promise<boolean> {
        return this.strategy.hasPermission(roleName, permission);
    }

    async assignRoleToUser(userId: InferIdType<ObjectId | string>, roleName: string): Promise<void> {
        return this.strategy.assignRoleToUser(userId, roleName);
    }

    async checkUserPermission(userId: InferIdType<ObjectId | string>, permission: string): Promise<boolean> {
        return this.strategy.checkUserPermission(userId, permission);
    }
}

export = AuthRealm;