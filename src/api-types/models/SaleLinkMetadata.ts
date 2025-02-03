/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Fields
 * - url: Sale url of the item
 * - price: Price of the item filled by llm agent
 * - currency: Currency of the item. Default is `USD`
 * - is_affiliated: Whether the sale is affiliated with our platform
 * - is_soldout: Whether the sale is soldout
 */
export type SaleLinkMetadata = {
    is_payout?: (boolean | null);
    price?: (string | null);
    currency?: (string | null);
    is_soldout?: (boolean | null);
    is_affiliated?: (boolean | null);
};

