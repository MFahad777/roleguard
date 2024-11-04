import { IBaseStrategy } from "./interfaces/IStrategy"

class RoleGuard {
    private strategy: IBaseStrategy;

    constructor(strategy: IBaseStrategy) {
        if (!strategy) {
            throw new Error('No strategy has been set. Please use a strategy first.');
        }
        this.strategy = strategy;
    }

    async addRole(role: any): Promise<any> {
        return this.strategy.addRole(role);
    }

    async removeRole(roleNameOrId: any) : Promise<any> {
        return this.strategy.removeRole(roleNameOrId);
    }

    async assignPermission(roleNameOrId: any, permission: string): Promise<any> {
        return this.strategy.assignPermission(roleNameOrId, permission);
    }

    async hasPermission(roleNameOrId: any, permission: string): Promise<boolean> {
        return this.strategy.hasPermission(roleNameOrId, permission);
    }

    async assignRoleToUser(userId: any, roleName: string): Promise<any> {
        return this.strategy.assignRoleToUser(userId, roleName);
    }

    async checkUserPermission(userId: any, permission: string): Promise<boolean> {
        return this.strategy.checkUserPermission(userId, permission);
    }
}

export = RoleGuard;