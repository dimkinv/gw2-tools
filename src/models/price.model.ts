export interface PriceResponse{
    id: number,
    whitelisted: boolean,
    buys: {
      quantity: number,
      unit_price: number
    },
    sells: {
      quantity: number,
      unit_price: number
    }
  }