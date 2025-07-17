export interface ChannelItem {
  id: string;
  title: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  tags: string[];
  imageUrl?: string;
} 