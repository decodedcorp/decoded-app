export const queryKeys = {
  // Auth related queries
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
  },

  // User related queries
  user: {
    profile: (id: string) => ['user', 'profile', id] as const,
    settings: (id: string) => ['user', 'settings', id] as const,
  },

  // OAuth related queries
  oauth: {
    google: ['oauth', 'google'] as const,
  },

  // Channels related queries
  channels: {
    all: ['channels'] as const,
    lists: () => [...queryKeys.channels.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.channels.lists(), filters] as const,
    details: () => [...queryKeys.channels.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.channels.details(), id] as const,
    stats: (id: string) => [...queryKeys.channels.detail(id), 'stats'] as const,
  },

  // Contents related queries
  contents: {
    all: ['contents'] as const,
    lists: () => [...queryKeys.contents.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.contents.lists(), filters] as const,
    details: () => [...queryKeys.contents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.contents.details(), id] as const,
    byChannel: (channelId: string) => [...queryKeys.contents.all, 'channel', channelId] as const,
    byProvider: (providerId: string) =>
      [...queryKeys.contents.all, 'provider', providerId] as const,
    likes: (contentId: string) => [...queryKeys.contents.detail(contentId), 'likes'] as const,
    likesStats: (contentId: string) => [...queryKeys.contents.likes(contentId), 'stats'] as const,
  },

  // Feeds related queries
  feeds: {
    all: ['feeds'] as const,
    lists: () => [...queryKeys.feeds.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.feeds.lists(), filters] as const,
    recent: (params?: Record<string, any>) => [...queryKeys.feeds.all, 'recent', params] as const,
    popular: (params?: Record<string, any>) => [...queryKeys.feeds.all, 'popular', params] as const,
    trending: (params?: Record<string, any>) =>
      [...queryKeys.feeds.all, 'trending', params] as const,
    mixed: (params?: Record<string, any>) => [...queryKeys.feeds.all, 'mixed', params] as const,
    channel: (channelId: string, params?: Record<string, any>) =>
      [...queryKeys.feeds.all, 'channel', channelId, params] as const,
    provider: (providerId: string, params?: Record<string, any>) =>
      [...queryKeys.feeds.all, 'provider', providerId, params] as const,
    search: (query: string, params?: Record<string, any>) =>
      [...queryKeys.feeds.all, 'search', query, params] as const,
    multiple: (params?: Record<string, any>) =>
      [...queryKeys.feeds.all, 'multiple', params] as const,
    stats: () => [...queryKeys.feeds.all, 'stats'] as const,
    health: () => [...queryKeys.feeds.all, 'health'] as const,
  },

  // Interactions related queries
  interactions: {
    all: ['interactions'] as const,
    likes: () => [...queryKeys.interactions.all, 'likes'] as const,
    myLikes: (params?: Record<string, any>) =>
      [...queryKeys.interactions.likes(), 'my', params] as const,
    subscriptions: () => [...queryKeys.interactions.all, 'subscriptions'] as const,
    mySubscriptions: (params?: Record<string, any>) =>
      [...queryKeys.interactions.subscriptions(), 'my', params] as const,
    notifications: () => [...queryKeys.interactions.all, 'notifications'] as const,
    myNotifications: (params?: Record<string, any>) =>
      [...queryKeys.interactions.notifications(), 'my', params] as const,
    stats: () => [...queryKeys.interactions.all, 'stats'] as const,
    myStats: () => [...queryKeys.interactions.stats(), 'my'] as const,
  },

  // Users related queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
  },
} as const;
