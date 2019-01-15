// @flow

import * as React from "react";
import {
  StyledRoot,
  StyledAvatar,
  StyledInfos,
  StyledUsername,
  StyledDate
} from "./styles";
import type { Article } from "../../lib/api";

type ArticleInfoProps =
  | {|
      placeholder: true,
      color: "green" | "white",
      className?: string
    |}
  | {|
      placeholder?: false,
      color: "green" | "white",
      pubdate?: boolean,
      className?: string,
      article: Article
    |};

const ArticleInfo = (props: ArticleInfoProps) => {
  if (props.placeholder) {
    return (
      <StyledRoot className={props.className}>
        <StyledAvatar placeholder />

        <StyledInfos>
          <StyledUsername placeholder color={props.color} />

          <br />

          <StyledDate placeholder />
        </StyledInfos>
      </StyledRoot>
    );
  } else {
    const path = `/profile/${encodeURIComponent(
      props.article.author.username
    )}`;

    return (
      <StyledRoot>
        <StyledAvatar
          path={path}
          username={props.article.author.username}
          image={props.article.author.image}
        />

        <StyledInfos>
          <StyledUsername
            color={props.color}
            path={path}
            username={props.article.author.username}
          />

          <br />

          <StyledDate
            pubdate={props.pubdate}
            date={new Date(props.article.createdAt)}
          />
        </StyledInfos>
      </StyledRoot>
    );
  }
};

export default ArticleInfo;
