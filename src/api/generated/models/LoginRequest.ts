/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for login request.
 *
 * :param jwt_token: The JWT token of the user(Required).
 * :param sui_address: The Sui address of the user(Required).
 * :param email: The email address of the user(Optional).
 * :param marketing: Whether the user agrees to marketing emails(Optional).
 */
export type LoginRequest = {
    jwt_token: string;
    sui_address: string;
    email?: (string | null);
    marketing?: boolean;
};

