import { logger } from "./logger";
import { getAndSaveMixMaxPricesForItems } from "./prices.logic";

let currentTimoutId: NodeJS.Timeout;
let isLoopActive = false;

export async function initPricesLoop(){
    logger.debug(`prices-fetcher::init: initiating pricing fetching loop`);
    isLoopActive = true;
    fetchPricesOnInterval();
}

async function fetchPricesOnInterval(){
    const response = await getAndSaveMixMaxPricesForItems();
    if(response.isError){
        logger.warn(`prices-fetcher::fetchPricesOnInterval: some prices hasn't been fetched successfully this time with error: ${response.error.message}`);
    }

    currentTimoutId = setTimeout(async () => {
        logger.debug('prices-fetcher::fetchPricesOnInterval: interval ended, initiating fetch');
        if(!isLoopActive){
            logger.debug('prices-fetcher::fetchPricesOnInterval: loop has been canceled, exiting loop');
            return;
        }

        await fetchPricesOnInterval();
    }, process.env.PRICE_FETCH_INTERVAL ? +process.env.PRICE_FETCH_INTERVAL : 10 * 60 * 1000 );
}

export function stopPricesLoop(){
    clearTimeout(currentTimoutId);
    isLoopActive = false;

    logger.debug(`prices-fetcher::stopPricesLoop: stop has been called cancelling current timeout and nearest loop`)
}