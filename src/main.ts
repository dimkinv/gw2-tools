import axios from 'axios';

const apiKey = 'A563377B-C3B0-8D4F-8FC7-009D7F41204B24220EB4-192D-4A5C-A977-2466782AAEF6';

const host = 'https://api.guildwars2.com';
const aggregatedPricing = `${host}/v2/commerce/prices`;
const ordersListings = `${host}/v2/commerce/listings`;

console.log(ordersListings);

async function main() {
    // const idsOnMarketResponse = await axios.get<number[]>(ordersListings);

    // console.log(idsOnMarketResponse.headers);

    for(const i of throttledRequests()){
        console.log(i);
    }
}

let counter = 0;

function* throttledRequests() {
    let counter = 0;
    while (counter < 600) {
        counter++;
        yield counter;
    }
}

main();