export interface PriceEntity {
    id: number;
    createdAt: string,
    buy: {
        quantity: number;
        maxBuyPrice: number;
    },
    sell: {
        quantity: number;
        minSellPrice: number;
    }
}