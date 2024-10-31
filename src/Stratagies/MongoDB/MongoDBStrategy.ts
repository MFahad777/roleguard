import { IStrategy } from "../../interfaces/IStrategy";
import { TRole } from "../../types/TRole";
import { MongoClient, Db, InferIdType, ObjectId } from "mongodb";

class MongoStrategy implements IStrategy {
    private client: MongoClient;
    private db: Db;
    private roleCollectionName : string = "roles";
    private userCollectionName : string = "users";

    constructor (
        client : MongoClient,
        dbName : string,
        roleCollectionName : string,
        userCollectionName : string
    ) {
        this.client = client;
        this.db = this.client.db(dbName);
        this.roleCollectionName = roleCollectionName;
        this.userCollectionName = userCollectionName;
    }

    async addRole(role: TRole): Promise<void> {
        await this.db.collection(this.roleCollectionName).insertOne(role);
    }

    async removeRole(roleName: string): Promise<void> {
        await this.db.collection(this.roleCollectionName).deleteOne({ name: roleName });
    }

    async assignPermission(roleName: string, permission: string): Promise<void> {
        await this.db.collection(this.roleCollectionName).updateOne(
            { name: roleName },
            { $addToSet: { permissions: permission } }
        );
    }

    async hasPermission(roleName: string, permission: string): Promise<boolean> {
        const role = await this.db.collection(this.roleCollectionName).findOne({ name: roleName });
        return role ? role.permissions.includes(permission) : false;
    }

    async assignRoleToUser(userId: InferIdType<ObjectId | string>, roleName: string): Promise<void> {
        await this.db.collection(this.userCollectionName).updateOne(
            { _id: userId },
            { $addToSet: { roles: roleName } }
        );
    }

    async checkUserPermission(userId: InferIdType<ObjectId | string>, permission: string): Promise<boolean> {

        const user = await this.db.collection(this.userCollectionName).findOne({ _id: userId });

        if (!user || !user.roles) {
            return false;
        }

        const roles = await this.db.collection(this.roleCollectionName).find({ name: { $in: user.roles } }).toArray();

        return roles.some(role => role.permissions.includes(permission));
    }
}

export = MongoStrategy;
