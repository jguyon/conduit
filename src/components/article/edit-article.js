// @flow

import * as React from "react";
import Button from "../button";
import type { Article } from "../../lib/api";

type EditArticleProps = {|
  article: Article
|};

const EditArticle = ({ article }: EditArticleProps) => (
  <Button
    type="link"
    color="light-silver"
    outline
    to={`/editor/${encodeURIComponent(article.slug)}`}
  >
    Edit Article
  </Button>
);

export default EditArticle;
