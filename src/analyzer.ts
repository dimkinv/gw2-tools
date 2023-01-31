import { getItems } from "./items.logic";
import { Listing } from "./models/listing.model";

export function analyzeListings(listings: Listing[]) {
    const items = getItems();

    for (const listing of listings) {
        const buyDecileIndex = Math.floor(listing.buys.length / 10);
        const top10thBuyDecile = listing.buys.slice(0, buyDecileIndex);

        const sellDecileIndex = Math.floor(listing.sells.length / 10);
        const top10thSellDecile = listing.sells.slice(0, sellDecileIndex);


        if (top10thBuyDecile.length === 0 || top10thSellDecile.length === 0) {
            continue;
        }

        const percentageDiff = (top10thSellDecile[0].unit_price / top10thBuyDecile[0].unit_price * 100) - 100;
        if (percentageDiff > 25 && percentageDiff < 40) {
            console.log(`${items[listing.id] ? items[listing.id]?.name : listing.id}: ${percentageDiff}`);
        }
    }
}