import { analyzeListings } from "./analyzer";
import { ErrorOrResponse, Response } from "./either";
import { getIdsForEndpoint, getItemsForIds } from "./gw2-api";
import { Listing } from "./models/listing.model";
import { logger } from "./logger";
import { insertManyListingsHistoryRecord, ListingHistoryRecord } from "./persistence";
import { listingsEndpoint } from "./urls";

export async function fetchAndSaveListings() {
    logger.debug(`listings.logic::fetchAndDaveListings: initiating fetch and save flow`);
    const ids = await getIdsForEndpoint(listingsEndpoint)

    if (ids.isError) {
        logger.error(`listings.logic::fetchAndDaveListings: error fetching ids for listings endpoint`);
        return;
    }
    logger.debug(`listings.logic::fetchAndDaveListings: got ${ids.response.length} ids`);

    const chunks: number[][] = [];
    while (ids.response.length > 0) {
        chunks.push(ids.response.splice(0, 200));
    }

    logger.debug(`listings.logic::fetchAndDaveListings: splitting ids into ${chunks.length} chunks`);


    let i = 0;
    while (chunks.length > 0) {
        const listingsChunks = await getItemsForIds<Listing>(listingsEndpoint, chunks.splice(0, 10));
        logger.debug(`listings.logic::fetchAndDaveListings: fetched chunks ${i * 10}-${i * 10 + 10}`);
        i++;

        const isErrors = listingsChunks.some(listing => listing.isError);
        if (isErrors) {
            logger.warn(`listings.logic::fetchAndDaveListings: some listing requests returned an error skipping them`);
        }

        const successfulListingsChunks = listingsChunks.filter(isSuccessfullListing);
        const date = new Date().toISOString();
        for (const listingChunk of successfulListingsChunks) {
            insertManyListingsHistoryRecord(listingChunk.response.map<ListingHistoryRecord>(listing => ({
                itemId: listing.id,
                listing,
                date
            })))
                .then(maybeError => {
                    if (maybeError.isError) {
                        logger.warn(`listings.logic::fetchAndDaveListings: error insrting listings into DB with error: ${maybeError.error.message}`);
                        return;
                    }

                    logger.debug(`listings.logic::fetchAndDaveListings: successfuly instered ${maybeError.response} listings into DB`);
                });
        }
    }
}

function isSuccessfullListing(listing: ErrorOrResponse<Listing[]>): listing is Response<Listing[]> {
    return !listing.isError;
}