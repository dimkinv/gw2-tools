import fs from 'fs';
import path from 'path';
import { Item, Listing } from './models/listing.model';
import { fetchAndSaveListings } from './listings.logic';
import { logger } from './logger';
import * as persistence from './persistence';
import { getAndSaveMixMaxPricesForItems } from './prices.logic';

const apiKey = 'A563377B-C3B0-8D4F-8FC7-009D7F41204B24220EB4-192D-4A5C-A977-2466782AAEF6';

async function main() {
    await persistence.init();
    logger.debug('main::main: initiating first get on listings');

    // await fetchAndSaveListings();

    await getAndSaveMixMaxPricesForItems();

    await persistence.close();
}

main();
