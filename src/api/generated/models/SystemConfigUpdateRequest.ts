/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to update system configuration
 */
export type SystemConfigUpdateRequest = {
    /**
     * Enable/disable free mode
     */
    is_free_mode?: (boolean | null);
    /**
     * Points per content provision
     */
    point_per_provide?: (number | null);
    /**
     * Number of action tickets
     */
    action_ticket_num?: (number | null);
    /**
     * Allowed action types for images
     */
    action_type_of_image?: (Array<string> | null);
    /**
     * Allowed action types for items
     */
    action_type_of_item?: (Array<string> | null);
    /**
     * Provider reward percentage
     */
    provider_reward_percentage?: (number | null);
    /**
     * Requester reward percentage
     */
    requester_reward_percentage?: (number | null);
    /**
     * Platform reward percentage
     */
    platform_reward_percentage?: (number | null);
    /**
     * List of tracked endpoints
     */
    tracked_endpoints?: (Array<string> | null);
    /**
     * Scoring weights for images
     */
    score_weights_of_image?: (Record<string, number> | null);
    /**
     * Scoring weights for items
     */
    score_weights_of_item?: (Record<string, number> | null);
    /**
     * Available link labels
     */
    link_label?: (Array<string> | null);
    /**
     * Identity categories
     */
    identity_category?: (Array<string> | null);
    /**
     * Available contexts
     */
    context?: (Array<string> | null);
};

