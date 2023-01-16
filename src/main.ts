import axios, { AxiosError, AxiosResponse } from 'axios';
import fs from 'fs';
import path from 'path';
import { getResourcesListByEndpoint } from './gw2-api';
import { Item, Listing } from './listing.model';
import { logger } from './logger';
import * as persistence from './persistence';

const apiKey = 'A563377B-C3B0-8D4F-8FC7-009D7F41204B24220EB4-192D-4A5C-A977-2466782AAEF6';

const host = 'https://api.guildwars2.com';
const aggregatedPricing = `${host}/v2/commerce/prices`;
const ordersListings = `${host}/v2/commerce/listings`;
const itemsEndpoint = `${host}/v2/items`;

console.log(ordersListings);

async function main() {
    await persistence.init();
    logger.debug('main::main: reading items file from disk');
    const items = JSON.parse(fs.readFileSync(path.join(__dirname, 'items.json'), 'utf8')) as { [id: string]: Item | undefined };
    logger.debug('main::main: done reading items');

    logger.debug('main::main: initiating first get on listings');

    const listings = await getResourcesListByEndpoint<Listing>(ordersListings);
    if (listings.isError) {
        logger.error(`main::main: ${listings.error.message}`)
        return;
    }

    logger.debug(`main::main: done reading listings with ${listings.response.length} results`);
    const currentDateTime = new Date().toISOString();
    await persistence.insertManyListingsHistoryRecord(listings.response.map(listing => ({
        date: currentDateTime,
        listing
    })));
    
    // analyzeResults(listings, items);
}

// function analyzeResults(listings: Listing[], items: { [id: string]: Item | undefined }) {
//     console.log('initiating listing analysis');

//     for (const listing of listings) {
//         if (listing.sells.length > 1 && items[listing.id]?.type === ItemType.CraftingMaterial) {
//             const diff = 100 - (listing.sells[0].unit_price / listing.sells[1].unit_price * 100);
//             if (diff > 50) {
//                 console.log(`found high sell difference for item "${items[listing.id]?.name ?? listing.id}" first order is ${listing.sells[0].unit_price}, second is ${listing.sells[1].unit_price}`);
//             }
//         }
//     }
// }

// async function updateItems() {
//     const ids = await getIdsForEndpoint(itemsEndpoint);
//     const items = await getItemsForIds<Item>(ids, itemsEndpoint);

//     const mappedItems: { [is: string]: Item } = {};
//     for (const item of items) {
//         mappedItems[item.id] = {
//             icon: item.icon,
//             id: item.id,
//             name: item.name,
//             type: item.type
//         }
//     }

//     fs.writeFileSync(path.join(__dirname, 'item.json'), JSON.stringify(mappedItems));
// }




main();
// updateItems();

