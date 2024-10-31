import {IStrategy} from "../../interfaces/IStrategy";
import {TRole} from "../../types/TRole";
import {MongoClient, Db, InferIdType, ObjectId, InsertOneResult, DeleteResult, UpdateResult} from "mongodb";

class MongoStrategy implements IStrategy {
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

    async addRole(role: TRole): Promise<InsertOneResult<Document>> {
        return await this.db.collection(this.roleCollectionName).insertOne(role);
    }

    async removeRole(roleNameOrId: InferIdType<ObjectId | string>): Promise<DeleteResult> {
        return await this.db
            .collection(this.roleCollectionName)
            .deleteOne({
                $or: [
                    {name: roleNameOrId},
                    {_id: new ObjectId(roleNameOrId)}
                ]
            });
    }

    async assignPermission(roleNameOrId: InferIdType<ObjectId | string>, permission: string): Promise<UpdateResult<Document>> {
       return await this.db.collection(this.roleCollectionName).updateOne(
            {$or: [{name: roleNameOrId}, {_id: new ObjectId(roleNameOrId)}]},
            {$addToSet: {permissions: permission}}
        );
    }

    async hasPermission(roleNameOrId: InferIdType<ObjectId | string>, permission: string): Promise<boolean> {
        const role = await this.db.
        collection(this.roleCollectionName)
            .findOne({$or: [{name: roleNameOrId}, {_id: new ObjectId(roleNameOrId)}]});
        return role ? role.permissions.includes(permission) : false;
    }

    async assignRoleToUser(userId: InferIdType<ObjectId | string>, roleName: string): Promise<UpdateResult<Document>> {

        const getUser = await this.db.collection(this.userCollectionName).findOne({
            _id : new ObjectId(userId)
        });

        const roles = getUser?.roles ?? [];

        return await this.db.collection(this.userCollectionName).updateOne(
            {_id: new ObjectId(userId)},
            {
                $set: {
                    roles: [...roles, roleName]
                }
            }
        );
    }

    async checkUserPermission(userId: InferIdType<ObjectId | string>, permission: string): Promise<boolean> {

        const user = await this.db.collection(this.userCollectionName).findOne({_id: new ObjectId(userId)});

        if (!user || !user.roles) {
            return false;
        }

        const roles = await this.db.collection(this.roleCollectionName).find({name: {$in: user.roles}}).toArray();

        return roles.some(role => role.permissions.includes(permission));
    }
}

export = MongoStrategy;
