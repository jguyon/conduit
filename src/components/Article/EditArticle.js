// @flow

import * as React from "react";
import cn from "classnames";
import { Link } from "@reach/router";
import type { Article } from "../../lib/api";

type EditArticleProps = {|
  article: Article
|};

const EditArticle = ({ article }: EditArticleProps) => (
  <Link
    to={`/editor/${encodeURIComponent(article.slug)}`}
    className={cn(
      "f6",
      "link",
      "moon-gray",
      "ba",
      "br2",
      "pointer",
      "dim",
      "pv1",
      "ph2"
    )}
  >
    Edit Article
  </Link>
);

export default EditArticle;
