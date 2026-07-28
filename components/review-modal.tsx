"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare } from "lucide-react";
import { useCreateReview } from "@/hooks/use-requests";
import { useState } from "react";

export function ReviewModal({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const { mutate: createReview, isPending } = useCreateReview();

  const handleSubmit = () => {
    if (!review.trim()) return;
    createReview({ requestId, rating, review }, {
      onSuccess: () => {
        setOpen(false);
        setReview("");
        setRating(5);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700">
          <MessageSquare className="h-4 w-4 mr-2" /> Leave Review
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>Share your experience about this rental property.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                >
                  <Star className={`h-8 w-8 transition-colors ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400/50"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Your Review</span>
            <Textarea
              placeholder="What did you like or dislike?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending || !review.trim()}>
            {isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
