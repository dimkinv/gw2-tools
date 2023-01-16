export interface Listing {
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

export interface Item {
    id: string;
    name: string;
    type: ItemType;
    icon: string;
}


export enum ItemType {
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