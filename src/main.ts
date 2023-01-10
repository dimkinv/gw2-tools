import axios, { AxiosError, AxiosResponse } from 'axios';
import fs from 'fs';
import path from 'path';

const apiKey = 'A563377B-C3B0-8D4F-8FC7-009D7F41204B24220EB4-192D-4A5C-A977-2466782AAEF6';

const host = 'https://api.guildwars2.com';
const aggregatedPricing = `${host}/v2/commerce/prices`;
const ordersListings = `${host}/v2/commerce/listings`;
const itemsEndpoint = `${host}/v2/items`;

console.log(ordersListings);

async function main() {
    console.log('reading items file from disk');
    const items = JSON.parse(fs.readFileSync(path.join(__dirname, 'items.json'), 'utf8')) as { [id: string]: Item | undefined };
    console.log('done reading items');

    console.log('initiating first get on listings');

    const listings = await readTradingPost();
    console.log(`done reading listings with ${listings.length} results`);

    analyzeResults(listings, items);
}

function analyzeResults(listings: Listing[], items: { [id: string]: Item | undefined }) {
    console.log('initiating listing analysis');

    for (const listing of listings) {
        if (listing.sells.length > 1 && items[listing.id]?.type === ItemType.CraftingMaterial) {
            const diff = 100 - (listing.sells[0].unit_price / listing.sells[1].unit_price * 100);
            if (diff > 50) {
                console.log(`found high sell difference for item "${items[listing.id]?.name ?? listing.id}" first order is ${listing.sells[0].unit_price}, second is ${listing.sells[1].unit_price}`);
            }
        }
    }
}

async function updateItems() {
    const ids = await getIdsForEndpoint(itemsEndpoint);
    const items = await getItemsForIds<Item>(ids, itemsEndpoint);

    const mappedItems: { [is: string]: Item } = {};
    for (const item of items) {
        mappedItems[item.id] = {
            icon: item.icon,
            id: item.id,
            name: item.name,
            type: item.type
        }
    }

    fs.writeFileSync(path.join(__dirname, 'item.json'), JSON.stringify(mappedItems));
}

async function readTradingPost() {
    const ids = await getIdsForEndpoint(ordersListings);
    const listings = await getItemsForIds<Listing>(ids, ordersListings);

    return listings;
}

async function getItemsForIds<T>(ids: number[], endpoint: string): Promise<T[]> {
    const groups: number[][] = [];

    while (ids.length !== 0) {
        groups.push(ids.splice(0, 200));
    }

    const items: T[] = [];
    while (groups.length !== 0) {
        try {
            const batch = groups.splice(0, 20);
            const promises = batch.map(ids => axios.get<T[]>(`${endpoint}?ids=${ids.join(',')}`));
            const responses = await Promise.all(promises);
            console.log('fetched batch');
            items.push(...responses.map(response => response.data).flat());
        }
        catch (error) {
            const e = error as AxiosError;
        }
    }

    return items;
}

async function getPricesForIds<T>(ids: number[]): Promise<T> {
    const idsQuery = ids.join(',');
    const response = await axios.get(`${ordersListings}?ids=${idsQuery}`);

    return response.data;
}

async function getIdsForEndpoint(endpoint: string): Promise<number[]> {
    const response = await axios.get(endpoint);
    return response.data;
}

main();
// updateItems();

interface Listing {
    id: number;
    buys: {
        listings: number;
        unit_price: number;
        quantity: number;
    }[],
    sells: {
        listings: number;
        unit_price: number;
        quantity: number;
    }[],
}

interface Item {
    id: string;
    name: string;
    type: ItemType;
    icon: string;
}


enum ItemType {
    Armor = 'Armor',
    Back = 'Back',
    Bag = 'Bags',
    Consumable = 'Consumable',
    Container = 'Container',
    CraftingMaterial = 'CraftingMaterial',
    Gathering = 'Gathering',
    Gizmo = 'Gizmo',
    JadeTechModule = 'JadeTechModule',
    Key = 'Key',
    MiniPet = 'MiniPet',
    PowerCore = 'PowerCore',
    Tool = 'Tool',
    Trait = 'Trait',
    Trinket = 'Trinket',
    Trophy = 'Trophy',
    UpgradeComponent = 'UpgradeComponent',
    Weapon = 'Weapon'
}