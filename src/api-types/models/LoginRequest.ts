/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateOptionalAgreement } from './UpdateOptionalAgreement';
/**
 * Schema for login request.
 *
 * :param email: The email of the user(Optional).
 * :param token: The token of the user(Required).
 */
export type LoginRequest = {
    token: string;
    email?: (string | null);
    aka?: (string | null);
    agreement?: (UpdateOptionalAgreement | null);
};

