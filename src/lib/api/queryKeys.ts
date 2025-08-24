export const queryKeys = {
  // Auth related queries
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
    status: ['auth', 'status'] as const,
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
    // Likes related queries
    likes: (id: string) => [...queryKeys.channels.detail(id), 'likes'] as const,
    likeStats: (id: string) => [...queryKeys.channels.likes(id), 'stats'] as const,
    // Mutation states
    mutations: () => [...queryKeys.channels.all, 'mutations'] as const,
    create: () => [...queryKeys.channels.mutations(), 'create'] as const,
    update: (id: string) => [...queryKeys.channels.mutations(), 'update', id] as const,
    delete: (id: string) => [...queryKeys.channels.mutations(), 'delete', id] as const,
    thumbnail: (id: string) => [...queryKeys.channels.mutations(), 'thumbnail', id] as const,
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
    bookmarks: () => [...queryKeys.users.all, 'bookmarks'] as const,
    myBookmarks: (params?: Record<string, any>) => [...queryKeys.users.bookmarks(), 'my', params] as const,
    bookmarkStatus: (contentId: string) => [...queryKeys.users.bookmarks(), 'status', contentId] as const,
  },

  // Pins related queries
  pins: {
    all: ['pins'] as const,
    byChannel: (channelId: string) => [...queryKeys.pins.all, 'channel', channelId] as const,
    byContent: (contentId: string) => [...queryKeys.pins.all, 'content', contentId] as const,
  },

  // Comments related queries
  comments: {
    all: ['comments'] as const,
    byContent: (contentId: string) => [...queryKeys.comments.all, 'content', contentId] as const,
    detail: (commentId: string) => [...queryKeys.comments.all, 'detail', commentId] as const,
    replies: (parentCommentId: string) => [...queryKeys.comments.all, 'replies', parentCommentId] as const,
    stats: (contentId: string) => [...queryKeys.comments.all, 'stats', contentId] as const,
    userStats: (userId: string) => [...queryKeys.comments.all, 'user-stats', userId] as const,
  },

  // Search related queries
  search: {
    all: ['search'] as const,
    contents: (query: string, limit?: number) => 
      [...queryKeys.search.all, 'contents', { query, limit }] as const,
    channels: (query: string, limit?: number) => 
      [...queryKeys.search.all, 'channels', { query, limit }] as const,
    channelContents: (channelId: string, query: string, limit?: number) => 
      [...queryKeys.search.all, 'channel-contents', { channelId, query, limit }] as const,
    autocomplete: (query: string, type?: 'all' | 'channels' | 'contents') => 
      [...queryKeys.search.all, 'autocomplete', { query, type }] as const,
  },
} as const;
