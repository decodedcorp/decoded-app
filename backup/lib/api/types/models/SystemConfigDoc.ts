/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SystemConfigDoc = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    is_free_mode?: boolean;
    point_per_provide?: number;
    action_ticket_num?: number;
    action_type_of_image?: Array<string>;
    action_type_of_item?: Array<string>;
    provider_reward_percentage?: number;
    requester_reward_percentage?: number;
    platform_reward_percentage?: number;
    tracked_endpoints: Array<string>;
    score_weights_of_image?: Record<string, number>;
    score_weights_of_item?: Record<string, number>;
    link_label?: Array<string>;
    identity_category?: Array<string>;
    context?: Array<string>;
};

