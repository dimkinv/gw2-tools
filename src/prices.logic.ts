import { createErrorOrResponse, ErrorOrResponse } from "./either";
import { getIdsForEndpoint, getItemsForIds, getResourcesListByEndpoint } from "./gw2-api";
import { logger } from "./logger";
import { PriceEntity } from "./models/price.entity";
import { PriceResponse } from "./models/price.model";
import { insertManyPrices } from "./persistence";
import { pricesEndpoint } from "./urls";

export async function getAndSaveMixMaxPricesForItems(): Promise<ErrorOrResponse<PriceEntity[]>>{
    const prices = await getResourcesListByEndpoint<PriceResponse>(pricesEndpoint);
    if(prices.isError){
        logger.error(`prices.logic::getMixMaxPricesForItems: error fetching prices, ${prices.error.message}`);
        return prices;
    }

    const measurementTime = new Date().toISOString();
    const pricesEntities = prices.response.map<PriceEntity>(price => ({
        id: price.id,
        buy: {
            maxBuyPrice: price.buys.unit_price,
            quantity: price.buys.quantity
        },
        createdAt: measurementTime,
        sell: {
            minSellPrice: price.sells.unit_price,
            quantity: price.sells.quantity
        }
    }));

    const respose = await insertManyPrices(pricesEntities);
    if(respose.isError){
        logger.error(`prices.logic::getMixMaxPricesForItems: error inserting prices into DB, error: ${respose.error.message}`);
        return respose;
    }


    logger.debug(`prices.logic::getMixMaxPricesForItems: successfully inserted ${respose.response} prices to DB`);
    return createErrorOrResponse(pricesEntities);
}