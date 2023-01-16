import { Listing } from "./listing.model";
import { MongoClient, Db, Collection } from 'mongodb';
import { logger } from "./logger";
import { createErrorOrResponse, ErrorOrResponse } from "./either";

const connectionString = 'mongodb://localhost:27017';

let client: MongoClient;
let db: Db;
let listingsCollection: Collection<ListingHistoryRecord>;

export interface ListingHistoryRecord {
    _id?: string;
    date: string;
    listing: Listing;
}


export async function init() {
    try {
        client = await MongoClient.connect(connectionString);
        logger.debug(`persistence::init: connected to DB at ${connectionString}`);
        db = client.db('gw2');
        listingsCollection = db.collection('listingsHistory');
    } catch (error) {
        const e = error as Error;
        logger.error(`persistence::init: erorr initializing client for ${connectionString} with error: ${e.message}`);
    }
}

export async function insertManyListingsHistoryRecord(listingsHistory: ListingHistoryRecord[]): Promise<ErrorOrResponse<void>> {
    try {
        const response = await listingsCollection.insertMany(listingsHistory);
        logger.debug(`persistence::insertManyListingsHistoryRecord: successfully insterted ${response.insertedCount} records.`)

        return createErrorOrResponse(undefined);
    } catch (error) {
        const e = error as Error;
        logger.error(`persistence::insertManyListingsHistoryRecord: error inserting listings to db with error ${e.message}`);
        return createErrorOrResponse<void>(e);
    }
}