import axios, { AxiosError } from "axios";
import { createErrorOrResponse, ErrorOrResponse } from "./either";
import { Listing } from "./listing.model";
import { logger } from "./logger";

export async function getResourcesListByEndpoint<T>(apiEndpoint: string): Promise<ErrorOrResponse<T[]>> {
    logger.debug(`gw2-api::getResourceByEndpoint: initiating fetch resources for endpoint ${apiEndpoint}`);
    const ids = await getIdsForEndpoint(apiEndpoint);

    if (ids.isError) {
        logger.error(`gw2-api::getResourceByEndpoint: error fetching ids for endpoint ${apiEndpoint}, with error: ${ids.error.message}`);
        return ids;
    }

    const items = await getItemsForIdsByBatches<T>(ids.response, apiEndpoint);
    return items;
}

export async function getItemsForIds<T>(endpoint: string, idsBulks: number[][]): Promise<ErrorOrResponse<T[]>[]> {
    logger.debug(`gw2-api::getItemsForIds: initiating bulk requests for endpoint ${endpoint}, creating ${idsBulks.length} requests`);
    const requestsUrls = idsBulks.map(ids => `${endpoint}?ids=${ids.join(',')}`);
    const requests = requestsUrls.map(requestUrl => axios.get<T[]>(requestUrl));

    const responses = await Promise.allSettled(requests);
    logger.debug(`gw2-api::getItemsForIds: finished bulk requests for endpoint ${endpoint}`);
    return responses.map<ErrorOrResponse<T[]>>(response => response.status === 'fulfilled' ?
        createErrorOrResponse(response.value.data) :
        createErrorOrResponse<T[]>(response.reason)
    );
}


async function getItemsForIdsByBatches<T>(ids: number[], apiEndpoint: string): Promise<ErrorOrResponse<T[]>> {
    logger.debug(`gw2-api::getItemsForIds: fetching items for ${ids.length} ids for endpoint  ${apiEndpoint}`)
    const groups: number[][] = [];

    while (ids.length !== 0) {
        groups.push(ids.splice(0, 200));
    }

    const items: T[] = [];
    while (groups.length !== 0) {
        try {
            const batch = groups.splice(0, 20);
            const promises = batch.map(ids => axios.get<T[]>(`${apiEndpoint}?ids=${ids.join(',')}`));
            const responses = await Promise.all(promises);
            items.push(...responses.map(response => response.data).flat());
            logger.silly(`gw2-api::getItemsForIds: fetched batch for endpoint ${apiEndpoint}, currently fetched ${items.length} items`);
        }
        catch (error) {
            const e = error as AxiosError;
            logger.error(`gw2-api::getItemsForIds: error teching items for ids for endpoint ${apiEndpoint} with error ${e.message}`);
            createErrorOrResponse<T[]>(e);

        }
    }

    return createErrorOrResponse(items);
}

export async function getIdsForEndpoint(endpoint: string): Promise<ErrorOrResponse<number[]>> {
    try {
        logger.debug(`gw2-api::getIdsForEndpoint: fetching ids for endpoint ${endpoint}`);
        const response = await axios.get<number[]>(endpoint);
        return createErrorOrResponse(response.data);
    } catch (error) {
        const e = error as AxiosError;
        logger.error(`gw2-api::getIdsForEndpoint: error fetching ids for endpoint ${endpoint} with error: ${e.message}`);
        return createErrorOrResponse<number[]>(e);
    }
}