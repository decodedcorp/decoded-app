import Image from 'next/image';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface CommentListProps {
  comments: Array<{
    id: number;
    user: {
      name: string;
      badge: string;
      avatar: string;
    };
    text: string;
    thumbsUp: number;
    thumbsDown: number;
  }>;
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div>
      <h3 className="text-base font-bold text-white mb-2">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start mb-3">
          <Image
            src={comment.user.avatar}
            alt={comment.user.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full mr-2 object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-white text-sm">
                {comment.user.name}
              </span>
              <span className="bg-[#F6FF4A] text-black text-[10px] px-1.5 py-0.5 rounded font-semibold">
                {comment.user.badge}
              </span>
            </div>
            <div className="text-white text-xs mb-2">{comment.text}</div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-primary transition-colors">
                <ThumbsUp size={12} />
                <span>{comment.thumbsUp}</span>
              </button>
              <button className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-400 transition-colors">
                <ThumbsDown size={12} />
                <span>{comment.thumbsDown}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 