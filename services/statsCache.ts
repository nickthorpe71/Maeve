import { cloneDeep } from "lodash";

export interface IStatsEntry {}

export interface IStatsCache {
    [key: string]: IStatsEntry;
}

export function createCache(): IStatsCache {
    return {};
}

export function get(cache: IStatsCache, key: string): IStatsEntry {
    return cache[key];
}

export function insert(
    cache: IStatsCache,
    key: string,
    value: IStatsEntry
): IStatsCache {
    const cacheClone = cloneDeep(cache);
    cacheClone[key] = value;
    return cacheClone;
}

export default {
    createCache,
    get,
    insert,
};
