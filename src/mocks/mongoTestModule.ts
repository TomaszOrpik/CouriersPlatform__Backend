import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;
let mongoUri: string;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) => MongooseModule.forRootAsync({
    useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        return {
            uri: mongoUri,
            ...options,
        }
    },
});

export const connectToDatabase = async () => {
    await mongoose.connect(mongoUri);
};

export const closeInMongoConnection = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
};

export const dropCollection = async (collectionName: string) => {
    await mongoose.connection.dropCollection(collectionName);
};

export const insertObjectIntoDatabase = async (
    modelName: string,
    schema: any,
    object: any): Promise<string> => {
    const Model = mongoose.model(modelName, schema);
    const doc = new Model({
        ...object
    });
    await doc.save();
    return doc._id;
};

export const findOneInCollection = async (
    modelName: string,
    schema: any,
    searchKey: string,
    searchValue: string): Promise<any> => {
    const Model = mongoose.model(modelName, schema);
    const result = await Model.findOne({ [searchKey]: searchValue });
    return result;
}