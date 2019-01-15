// @flow

import * as React from "react";
import { StyledEdit } from "./article-styles";
import type { Article } from "../../lib/api";

type EditArticleProps = {|
  article: Article
|};

const EditArticle = ({ article }: EditArticleProps) => (
  <StyledEdit path={`/editor/${encodeURIComponent(article.slug)}`} />
);

export default EditArticle;
