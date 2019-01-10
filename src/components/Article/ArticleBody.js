// @flow

import * as React from "react";
import Markdown from "react-markdown";
import cn from "classnames";

const RendererHr = (props: {}) => (
  <hr {...props} className={cn("light-gray", "bt", "bl-0", "br-0", "bb-0")} />
);

const RendererLink = ({ children, ...props }: { children?: React.Node }) => (
  <a {...props} className={cn("link", "green", "underline-hover")}>
    {children}
  </a>
);

const renderers = {
  thematicBreak: RendererHr,
  link: RendererLink,
  linkReference: RendererLink
};

type ArticleBodyProps = {|
  body: string
|};

class ArticleBody extends React.PureComponent<ArticleBodyProps> {
  render() {
    const { body } = this.props;
    return <Markdown source={body} renderers={renderers} />;
  }
}

export default ArticleBody;
