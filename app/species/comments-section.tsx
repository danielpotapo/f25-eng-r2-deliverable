"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { useCallback, useEffect, useState } from "react";

type Comment = Database["public"]["Tables"]["comments"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Comment row joined with its author's profile via comments_author_fkey
type CommentWithAuthor = Comment & {
  profiles: Pick<Profile, "display_name"> | null;
};

export default function CommentsSection({ speciesId, userId }: { speciesId: number; userId: string }) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchComments = useCallback(async () => {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles(display_name)")
      .eq("species_id", speciesId)
      .order("created_at", { ascending: false });

    if (error) {
      return toast({
        title: "Could not load comments.",
        description: error.message,
        variant: "destructive",
      });
    }

    setComments(data);
  }, [speciesId]);

  // Load comments when the dialog containing this section mounts
  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);

  const addComment = async () => {
    const content = newComment.trim();
    if (!content) return;

    setIsSubmitting(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("comments").insert([{ species_id: speciesId, author: userId, content }]);
    setIsSubmitting(false);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    setNewComment("");
    await fetchComments();
  };

  const deleteComment = async (commentId: number) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("comments").delete().eq("id", commentId);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    await fetchComments();
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="mb-2 text-lg font-semibold">Comments</h4>
      <div className="mb-4 flex flex-col items-end gap-2">
        <Textarea
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          placeholder="Leave a comment..."
        />
        <Button type="button" onClick={() => void addComment()} disabled={isSubmitting || newComment.trim() === ""}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded border p-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{comment.profiles?.display_name ?? "Unknown user"}</p>
                <p className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleString()}</p>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm">{comment.content}</p>
              {comment.author === userId && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={() => void deleteComment(comment.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
