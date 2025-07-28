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
  },

  // Contents related queries
  contents: {
    all: ['contents'] as const,
    lists: () => [...queryKeys.contents.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.contents.lists(), filters] as const,
    details: () => [...queryKeys.contents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.contents.details(), id] as const,
  },

  // Feeds related queries
  feeds: {
    all: ['feeds'] as const,
    lists: () => [...queryKeys.feeds.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.feeds.lists(), filters] as const,
  },

  // Users related queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
  },
} as const;
