// @flow

import * as React from "react";
import {
  StyledComment,
  StyledCommentBody,
  StyledCommentBottom,
  StyledCommentAvatar,
  StyledCommentUsername,
  StyledCommentDate
} from "./comment-styles";
import RemoveComment from "./remove-comment";
import * as api from "../../lib/api";

const authorProfilePath = (comment: api.Comment) =>
  `/profile/${encodeURIComponent(comment.author.username)}`;

type CommentProps = {|
  currentUser: ?api.User,
  slug: string,
  comment: api.Comment,
  onRemoveComment: number => void
|};

class Comment extends React.PureComponent<CommentProps> {
  render() {
    const { comment, slug, onRemoveComment, currentUser } = this.props;

    return (
      <StyledComment tag="article">
        <StyledCommentBody>{comment.body}</StyledCommentBody>

        <StyledCommentBottom>
          <StyledCommentAvatar
            path={authorProfilePath(comment)}
            username={comment.author.username}
            image={comment.author.image}
          />

          <StyledCommentUsername
            path={authorProfilePath(comment)}
            username={comment.author.username}
          />

          <StyledCommentDate date={new Date(comment.createdAt)} pubdate />

          {currentUser && currentUser.username === comment.author.username && (
            <RemoveComment
              currentUser={currentUser}
              slug={slug}
              comment={comment}
              onRemoveComment={onRemoveComment}
            />
          )}
        </StyledCommentBottom>
      </StyledComment>
    );
  }
}

export default Comment;
