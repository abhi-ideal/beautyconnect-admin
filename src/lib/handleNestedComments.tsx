import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName, titleCase } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function renderNestedComments(
  comments: any,
  moreComments: any,
  isLoader: any,
  hideReplies: any
) {

  if (!comments || comments.length === 0) return null;

  return comments.map((comment: any, index: number) => (
      <div key={index}>
        <div  className="flex gap-3 ml-8">
          <Avatar className="h-8 w-8 border border-gray-700">
            <AvatarImage
              src={comment?.userInfo?.avatar}
              alt={comment?.userInfo?.firstName || "Avatar image"}
            />
            <AvatarFallback>
              {formatName(comment?.userInfo?.firstName || "Default Image")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-muted rounded-lg p-3">
              <p className="font-semibold">
                {titleCase(comment?.userInfo?.firstName) +
                  " " +
                  titleCase(comment?.userInfo?.lastName)}
              </p>
              <p className="text-sm">{comment?.comment}</p>
            </div>
            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
              <span>
                {comment?.totalLike ? comment?.totalLike : 0}{" "}
                {comment?.totalLike > 1 ? "likes" : "like"}
              </span>
              <span>
                {comment?.createdAt
                  ? `${formatDistanceToNow(new Date(comment?.createdAt))} ago`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {comment.children?.length > 0 && (
          <div className="mt-2 ml-8">
            {/* <Button
              className="mt-2"
              variant="link"
              onClick={() => hideReplies(comment.id)}
            >
              Hide Replies
            </Button> */}
            {renderNestedComments(
              comment.children,
              moreComments,
              isLoader,
              hideReplies
            )}
          </div>
        )}
        {comment.totalComment > (comment.children?.length || 0) && (
          <span className="flex justify-end">
            <Button
              className="mt-2"
              variant="link"
              onClick={() => moreComments(comment.id, comment.offset || 0)}
            >
              View {comment.totalComment - (comment.children?.length || 0)} More
              Replies
            </Button>
          </span>
        )}
      </div>
  ));
}
