/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * ⚠️ WARNING
 * -----------------
 * - This must be synchronized with `RedisGetTrendingResult` in `src/redis.py`
 * - Should be modified after `RedisGetTrendingResult` is changed
 *
 * Fields
 * - value: Value of the trending item(e.g document `id`)
 * - score: Score of the trending item
 */
export type RedisGetTrendingResult = {
    value: string;
    score: number;
};

