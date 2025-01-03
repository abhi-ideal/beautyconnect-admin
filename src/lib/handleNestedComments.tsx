import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName, titleCase } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function renderNestedComments(
  replies: any,
  moreReply: any,
  isLoader: any,
  hideReplies: any
) {

  if (!replies?.parentComment || replies?.parentComment.length == 0) return null;


  return replies?.parentComment.map((nestedReply: any, index: number) => (
      <div key={index}>
        <div  className="flex gap-3 ml-8">
          <Avatar className="h-8 w-8 border border-gray-700">
            <AvatarImage
              src={nestedReply?.users?.profile}
              alt={nestedReply?.users?.name || "Avatar image"}
            />
            <AvatarFallback>
              {formatName(nestedReply?.users?.name || "Default Image")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-muted rounded-lg p-3">
              <p className="font-semibold">
                { nestedReply?.users?.name ?  titleCase(nestedReply?.users?.name) : "N/A" }
              </p>
              <p className="text-sm">{nestedReply?.comment}</p>
            </div>
            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
              <span>
                {nestedReply?.commentLikes ? nestedReply?.commentLikes : 0}{" "}
                {nestedReply?.commentLikes > 1 ? "likes" : "like"}
              </span>
              <span>
                {nestedReply?.createdAt
                  ? `${formatDistanceToNow(new Date(nestedReply?.createdAt))} ago`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {nestedReply.totalCount > 0 && (
          <div className="mt-2 ml-8">
            {/* <Button
              className="mt-2"
              variant="link"
              onClick={() => hideReplies(comment.id)}
            >
              Hide Replies
            </Button> */}
            { replies && renderNestedComments(
             replies,
              moreReply,
              isLoader,
              hideReplies
            )}
          </div>
        )}
        {(nestedReply.totalComment >  0) && (nestedReply.totalCount !== replies?.parentComment?.length) && (
          <span className="flex justify-end">
            <Button
              className="mt-2"
              variant="link"
              onClick={() => moreReply(nestedReply.id, 0)}
            >
              View {nestedReply.totalComment - (replies?.parentComment?.length || 0)} More
              Replies
            </Button>
          </span>
        )}
      </div>
  ));
}
