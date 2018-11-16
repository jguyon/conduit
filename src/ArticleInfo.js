// @flow

import * as React from "react";
import { Link } from "@reach/router";
import cn from "classnames";
import * as api from "./api";

const prettyMonth = (date: Date) => {
  switch (date.getMonth()) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      throw new Error("invalid month");
  }
};

type PrettyDateProps = {
  date: Date
};

const PrettyDate = ({ date, ...props }: PrettyDateProps) => (
  <time {...props} dateTime={date.toISOString()}>
    {prettyMonth(date)} {date.getDate()}, {date.getFullYear()}
  </time>
);

type ArticleInfoProps = {
  color: "green" | "white",
  article: api.Article,
  className?: string
};

const authorProfilePath = (article: api.Article) =>
  `/profile/${encodeURIComponent(article.author.username)}`;

const ArticleInfo = ({
  color,
  article,
  className,
  ...props
}: ArticleInfoProps) => (
  <div {...props} className={cn(className, "flex")}>
    <Link to={authorProfilePath(article)}>
      <img
        className={cn("br-100", "h2", "w2", "dib", "overflow-hidden")}
        alt={article.author.username}
        src={
          article.author.image === ""
            ? "https://static.productionready.io/images/smiley-cyrus.jpg"
            : article.author.image
        }
      />
    </Link>

    <div className={cn("ml2")}>
      <Link
        className={cn("link", color, "underline-hover")}
        to={authorProfilePath(article)}
      >
        {article.author.username}
      </Link>

      <br />

      <PrettyDate
        className={cn("moon-gray", "f6")}
        pubdate="pubdate"
        date={new Date(article.createdAt)}
      />
    </div>
  </div>
);

export default ArticleInfo;
