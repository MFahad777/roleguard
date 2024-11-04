import {IMongooseStrategy} from "../../interfaces/IStrategy";
import {IUser, IRole} from "../../interfaces/IModel";
import {Role} from "../../types/Role";
import {Model, QueryWithHelpers} from "mongoose";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";

class MongooseStrategy implements IMongooseStrategy {

    private readonly roleModel: Model<IRole>;
    private userModel: Model<IUser>;

    constructor(roleModel: Model<IRole>, userModel: Model<IUser>) {
        this.roleModel = roleModel;
        this.userModel = userModel;
    }

    async addRole(role: Role): Promise<Document> {
        const newRole = new this.roleModel(role);
        return await newRole.save();
    }

    async removeRole(roleNameOrId: string): Promise<QueryWithHelpers<DeleteResult, Document>> {

        const filter = /^[0-9a-fA-F]{24}$/.test(roleNameOrId)
            ? {_id: new ObjectId(roleNameOrId)}
            : {name: roleNameOrId}

        return this.roleModel.deleteOne(filter);
    }

    async assignPermission(roleNameOrId: string, permission: string): Promise<QueryWithHelpers<UpdateResult, Document>> {

        const filter = /^[0-9a-fA-F]{24}$/.test(roleNameOrId)
            ? {_id: new ObjectId(roleNameOrId)}
            : {name: roleNameOrId};

        return this.roleModel.updateOne(filter, {$addToSet: {permissions: permission}});
    }

    async hasPermission(roleNameOrId: string, permission: string): Promise<boolean> {
        const filter = /^[0-9a-fA-F]{24}$/.test(roleNameOrId) ? {_id: new ObjectId(roleNameOrId)} : {name: roleNameOrId};
        const role = await this.roleModel.findOne(filter).lean().exec();
        return role ? role.permissions.includes(permission) : false;
    }

    async assignRoleToUser(userId: string, roleName: string): Promise<QueryWithHelpers<UpdateResult<Document>, Document>> {
        return this.userModel.updateOne({_id: new ObjectId(userId)}, {$addToSet: {roles: roleName}});
    }

    async checkUserPermission(userId: string, permission: string): Promise<boolean> {
        const user = await this.userModel.findById(userId).lean().exec();
        if (!user || !user.roles) return false;

        const roles = await this.roleModel.find({name: {$in: user.roles}}).lean().exec();
        return roles.some(role => role.permissions.includes(permission));
    }
}

export = MongooseStrategy;
