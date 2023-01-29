import { Item } from "./listing.model";
import { logger } from "./logger";
import fs from 'fs';
import path from 'path';

let items: { [id: string]: Item | undefined } | null = null;
export function getItems() {
    if (!items) {
        logger.debug('main::main: reading items file from disk');
        items = JSON.parse(fs.readFileSync(path.join(__dirname, 'items.json'), 'utf8')) as { [id: string]: Item | undefined };
        logger.debug('main::main: done reading items');
    }

    return items;

}