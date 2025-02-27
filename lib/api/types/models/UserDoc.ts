/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Badge } from './Badge';
import type { UserAgreement } from './UserAgreement';
import type { UserGrade } from './UserGrade';
import type { UserRole } from './UserRole';
import type { UserStatus } from './UserStatus';
/**
 * Document for `user`
 */
export type UserDoc = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    aka?: (string | null);
    email?: (string | null);
    token_id?: (string | null);
    salt?: (string | null);
    item_like?: (Array<string> | null);
    image_like?: (Array<string> | null);
    requested?: (Record<string, Array<string>> | null);
    provided?: (Record<string, Array<string>> | null);
    action_ticket_num?: number;
    point?: number;
    role?: UserRole;
    grade?: UserGrade;
    status?: UserStatus;
    agreement?: UserAgreement;
    badges?: (Array<Badge> | null);
    created_at?: string;
    last_login?: string;
};

