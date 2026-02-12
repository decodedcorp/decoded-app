"use client";

import { useState } from "react";
import { Send, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountAvatar } from "./AccountAvatar";
import { formatRelativeTime } from "@/lib/utils";

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export interface CommentSectionProps {
  comments?: Comment[];
  className?: string;
  title?: string;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    author: { name: "Minjae Kim" },
    text: "Love this look! The styling is so on point.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 12,
    replies: [
      {
        id: "1-1",
        author: { name: "Jiwoo Park" },
        text: "Right? The accessories make the whole outfit.",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        likes: 3,
      },
    ],
  },
  {
    id: "2",
    author: { name: "Soyeon Lee" },
    text: "Where can I find the jacket? Been looking everywhere!",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 8,
  },
  {
    id: "3",
    author: { name: "Hyunwoo Choi" },
    text: "Great decode, very helpful for finding similar items.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: 5,
  },
];

function CommentItem({
  comment,
  depth = 0,
}: {
  comment: Comment;
  depth?: number;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-10")}>
      <AccountAvatar
        name={comment.author.name}
        src={comment.author.avatar}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">
            {comment.author.name}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-foreground/90 mt-0.5">{comment.text}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <button
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Like comment by ${comment.author.name}`}
          >
            Like ({comment.likes})
          </button>
          <button
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Reply to ${comment.author.name}`}
          >
            Reply
          </button>
          <button
            className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="More"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>

        {hasReplies && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            {showReplies ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            {showReplies
              ? "Hide replies"
              : `View ${comment.replies!.length} ${comment.replies!.length === 1 ? "reply" : "replies"}`}
          </button>
        )}

        {showReplies &&
          comment.replies?.map((reply) => (
            <div key={reply.id} className="mt-3">
              <CommentItem comment={reply} depth={depth + 1} />
            </div>
          ))}
      </div>
    </div>
  );
}

export function CommentSection({
  comments = MOCK_COMMENTS,
  className,
  title = "Comments",
}: CommentSectionProps) {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-semibold">
        {title} ({comments.length})
      </h3>

      {/* Comment input */}
      <div className="flex items-center gap-3">
        <AccountAvatar name="You" size="sm" />
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a comment..."
            className="w-full rounded-full bg-muted px-4 py-2 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors",
              inputValue.trim()
                ? "text-primary hover:bg-primary/10"
                : "text-muted-foreground pointer-events-none"
            )}
            aria-label="Send comment"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
