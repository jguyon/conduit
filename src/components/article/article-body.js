// @flow

import * as React from "react";
import { StyledBody, StyledBodyHr, StyledBodyLink } from "./article-styles";
import Markdown from "react-markdown";

const renderers = {
  thematicBreak: StyledBodyHr,
  link: StyledBodyLink,
  linkReference: StyledBodyLink
};

type ArticleBodyProps = {|
  body: string
|};

class ArticleBody extends React.PureComponent<ArticleBodyProps> {
  render() {
    const { body } = this.props;

    return (
      <StyledBody>
        <Markdown source={body} renderers={renderers} />
      </StyledBody>
    );
  }
}

export default ArticleBody;
