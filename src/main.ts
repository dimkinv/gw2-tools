import fs from 'fs';
import path from 'path';
import { Item, Listing } from './listing.model';
import { fetchAndSaveListings } from './listings.logic';
import { logger } from './logger';
import * as persistence from './persistence';

const apiKey = 'A563377B-C3B0-8D4F-8FC7-009D7F41204B24220EB4-192D-4A5C-A977-2466782AAEF6';

async function main() {
    await persistence.init();
    logger.debug('main::main: initiating first get on listings');

    fetchAndSaveListings();

    // const listings = await getResourcesListByEndpoint<Listing>(ordersListings);
    // if (listings.isError) {
    //     logger.error(`main::main: ${listings.error.message}`)
    //     return;
    // }

    // logger.debug(`main::main: done reading listings with ${listings.response.length} results`);
    // const currentDateTime = new Date().toISOString();
    // await persistence.insertManyListingsHistoryRecord(listings.response.map(listing => ({
    //     date: currentDateTime,
    //     itemId: listing.id,
    //     listing
    // })));
    
}

main();
