import { ChannelCard } from '@/components/ChannelCard';

// Simple test data
const testChannel = {
  id: '1',
  name: 'Test Channel',
  description: 'This is a test channel for ChannelCard component',
  profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
  isVerified: true,
  followerCount: 1234,
  contentCount: 56,
  category: 'Test',
};

export default function ChannelCardTestPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-sm mx-auto">
        <ChannelCard 
          channel={testChannel}
          useSubscriptionHook={true}
          showLikeButton={true}
        />
      </div>
    </div>
  );
}
