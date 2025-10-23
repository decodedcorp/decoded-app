export interface LinkPreview {
  title: string;
  description: string;
  image: string;
  domain: string;
  favicon: string;
  url: string;
  author?: string;
  publishedAt?: string;
  category?: string;
  readTime?: string;
}

// Mock data for different domains
const MOCK_PREVIEWS: Record<string, Omit<LinkPreview, 'domain' | 'favicon' | 'url'>> = {
  'github.com': {
    title: 'GitHub Repository - Open Source Project',
    description:
      'Explore this amazing open source project with comprehensive documentation and active community contributions.',
    image: 'https://picsum.photos/800/500?random=1',
    author: 'Open Source Community',
    publishedAt: '2024-01-15',
    category: 'Development',
    readTime: '5 min read',
  },
  'medium.com': {
    title: 'Insightful Article on Medium',
    description:
      'A deep dive into modern development practices, exploring best practices and innovative approaches to software engineering.',
    image: 'https://picsum.photos/800/500?random=2',
    author: 'Tech Writer',
    publishedAt: '2024-01-20',
    category: 'Technology',
    readTime: '8 min read',
  },
  'youtube.com': {
    title: 'Educational Video Tutorial',
    description:
      'Learn advanced techniques and best practices through this comprehensive video guide with step-by-step instructions.',
    image: 'https://picsum.photos/800/500?random=3',
    author: 'Tech Educator',
    publishedAt: '2024-01-18',
    category: 'Education',
    readTime: '15 min watch',
  },
  'stackoverflow.com': {
    title: 'Technical Q&A on Stack Overflow',
    description:
      'Find answers to complex programming questions with detailed explanations from experienced developers.',
    image: 'https://picsum.photos/800/500?random=4',
    author: 'Stack Overflow Community',
    publishedAt: '2024-01-22',
    category: 'Programming',
    readTime: '3 min read',
  },
  'dev.to': {
    title: 'Developer Blog Post',
    description:
      'Practical insights and real-world experiences shared by developers in the community.',
    image: 'https://picsum.photos/800/500?random=5',
    author: 'Dev Community',
    publishedAt: '2024-01-19',
    category: 'Development',
    readTime: '6 min read',
  },
  'notion.so': {
    title: 'Notion Documentation Page',
    description: 'Comprehensive documentation and guides organized in a clean, accessible format.',
    image: 'https://picsum.photos/800/500?random=6',
    author: 'Notion Team',
    publishedAt: '2024-01-21',
    category: 'Documentation',
    readTime: '4 min read',
  },
};

const DEFAULT_PREVIEW = {
  title: 'Web Page',
  description:
    'This link contains valuable information that will be analyzed by AI based on your selected prompt.',
  image: 'https://picsum.photos/800/500?random=0',
  author: 'Unknown Author',
  publishedAt: '2024-01-01',
  category: 'General',
  readTime: '5 min read',
};

/**
 * Get mock link preview data based on URL
 * In production, this would call a real metadata extraction service
 */
export const getMockLinkPreview = (url: string): LinkPreview => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');

    // Find matching mock data
    const mockData = MOCK_PREVIEWS[domain] || DEFAULT_PREVIEW;

    return {
      ...mockData,
      domain: domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      url: url,
    };
  } catch (error) {
    // Invalid URL - return default
    return {
      ...DEFAULT_PREVIEW,
      domain: 'example.com',
      favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32',
      url: url,
    };
  }
};

/**
 * Simulate async loading for more realistic UX
 */
export const getMockLinkPreviewAsync = async (url: string): Promise<LinkPreview> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return getMockLinkPreview(url);
};
