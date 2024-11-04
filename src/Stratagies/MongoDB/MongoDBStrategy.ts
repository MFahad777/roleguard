import { IMongoDBStrategy } from "../../interfaces/IStrategy";
import {TRole} from "../../types/TRole";
import {MongoClient, Db, ObjectId, InsertOneResult, DeleteResult, UpdateResult, Filter, Document} from "mongodb";

class MongoStrategy implements IMongoDBStrategy {
    private client: MongoClient;
    private db: Db;
    private roleCollectionName: string = "roles";
    private userCollectionName: string = "users";

    constructor(
        client: MongoClient,
        dbName: string,
        roleCollectionName: string,
        userCollectionName: string
    ) {
        this.client = client;
        this.db = this.client.db(dbName);
        this.roleCollectionName = roleCollectionName;
        this.userCollectionName = userCollectionName;
    }

    async addRole(role: TRole): Promise<InsertOneResult> {
        return await this.db.collection(this.roleCollectionName).insertOne(role);
    }

    async removeRole(roleNameOrId: string): Promise<DeleteResult> {
        return await this.db
            .collection(this.roleCollectionName)
            .deleteOne({
                $or: [
                    {name: roleNameOrId},
                    {_id: new ObjectId(roleNameOrId)}
                ]
            });
    }

    async assignPermission(roleNameOrId: string, permission: string): Promise<UpdateResult> {
       return await this.db.collection(this.roleCollectionName).updateOne(
            {$or: [{name: roleNameOrId}, {_id: new ObjectId(roleNameOrId)}]},
            {$addToSet: {permissions: permission}}
        );
    }

    async hasPermission(roleNameOrId: string, permission: string): Promise<boolean> {

        const role = await this.db.
            collection(this.roleCollectionName)
            .findOne({$or: [{name: roleNameOrId}, {_id: new ObjectId(roleNameOrId)}]});

        return role ? role.permissions.includes(permission) : false;
    }

    async assignRoleToUser(userId: string, roleName: string): Promise<UpdateResult> {

        const filter = {
            _id : new ObjectId(userId)
        } as Filter<Document>

        const getUser = await this.db.collection(this.userCollectionName).findOne(filter);

        const roles = getUser?.roles ?? [];

        return await this.db.collection(this.userCollectionName).updateOne(
            filter,
            {
                $set: {
                    roles: [...roles, roleName]
                }
            }
        );
    }

    async checkUserPermission(userId: string, permission: string): Promise<boolean> {

        const filter = {
            _id : new ObjectId(userId)
        } as Filter<Document>

        const user = await this.db.collection(this.userCollectionName).findOne(filter);

        if (!user || !user.roles) {
            return false;
        }

        const roles = await this.db.collection(this.roleCollectionName).find({name: {$in: user.roles}}).toArray();

        return roles.some(role => role.permissions.includes(permission));
    }
}

export = MongoStrategy;
