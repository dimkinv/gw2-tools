import { Listing } from "./models/listing.model";
import { MongoClient, Db, Collection } from 'mongodb';
import { logger } from "./logger";
import { createErrorOrResponse, ErrorOrResponse } from "./either";
import { PriceEntity } from "./models/price.entity";

const connectionString = process.env.MONGO_CONNECTION_STRING ?? 'mongodb://localhost:27017';

let client: MongoClient;
let db: Db;
let listingsCollection: Collection<ListingHistoryRecord>;
let pricesCollection: Collection<PriceEntity>;

export interface ListingHistoryRecord {
    _id?: string;
    itemId: number;
    date: string;
    listing: Listing;
}


export async function init() {
    try {
        logger.debug(`persistence::root: mongodb connectionstring: ${connectionString}`);
        client = await MongoClient.connect(connectionString);
        logger.debug(`persistence::init: connected to DB at ${connectionString}`);
        db = client.db('gw2');
        listingsCollection = db.collection('listingsHistory');
        pricesCollection = db.collection('pricesCollection');

        logger.debug(`persistence::init: creating index on date field`);
        await listingsCollection.createIndex({ date: 1 });

    } catch (error) {
        const e = error as Error;
        logger.error(`persistence::init: erorr initializing client for ${connectionString} with error: ${e.message}`);
    }
}

export async function close(){
    try {
        await client.close();
    } catch (err) {
        logger.warn('persistence::close: error closing db connection');
    }
}

export async function insertManyListingsHistoryRecord(listingsHistory: ListingHistoryRecord[]): Promise<ErrorOrResponse<number>> {
    try {
        const response = await listingsCollection.insertMany(listingsHistory);
        logger.debug(`persistence::insertManyListingsHistoryRecord: successfully insterted ${response.insertedCount} records.`)

        return createErrorOrResponse(response.insertedCount);
    } catch (error) {
        const e = error as Error;
        logger.error(`persistence::insertManyListingsHistoryRecord: error inserting listings to db with error ${e.message}`);
        return createErrorOrResponse<number>(e);
    }
}

export async function insertManyPrices(prices: PriceEntity[]){
    try {
        const response = await pricesCollection.insertMany(prices);
        logger.debug(`persistence::insertManyPrices: successfully insterted ${response.insertedCount} records.`)

        return createErrorOrResponse(response.insertedCount);
    } catch (error) {
        const e = error as Error;
        logger.error(`persistence::insertManyPrices: error inserting prices to db with error ${e.message}`);
        return createErrorOrResponse<number>(e);
    }
}