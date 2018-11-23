// @flow

import * as React from "react";
import { navigate } from "@reach/router";
import cn from "classnames";
import { Form, GlobalError, TextInput, TextArea, Submit } from "./Form";
import * as api from "./api";

type NewArticleProps = {|
  createArticle: typeof api.createArticle,
  currentUser: api.User
|};

type NewArticleState = {|
  submitting: boolean,
  error:
    | {| type: "none" |}
    | {| type: "network" |}
    | {|
        type: "fields",
        title?: string[],
        description?: string[],
        body?: string[],
        tagList?: string[]
      |},
  title: string,
  description: string,
  body: string,
  tagList: string
|};

class NewArticle extends React.Component<NewArticleProps, NewArticleState> {
  state = {
    submitting: false,
    error: { type: "none" },
    title: "",
    description: "",
    body: "",
    tagList: ""
  };

  titleInputRef = React.createRef<"input">();
  descriptionInputRef = React.createRef<"input">();
  bodyInputRef = React.createRef<"textarea">();
  tagListInputRef = React.createRef<"input">();

  focusFirstInvalidInput() {
    if (this.state.error.type === "fields") {
      if (
        this.state.error.title &&
        this.state.error.title[0] &&
        this.titleInputRef.current
      ) {
        this.titleInputRef.current.select();
      } else if (
        this.state.error.description &&
        this.state.error.description[0] &&
        this.descriptionInputRef.current
      ) {
        this.descriptionInputRef.current.select();
      } else if (
        this.state.error.body &&
        this.state.body[0] &&
        this.bodyInputRef.current
      ) {
        this.bodyInputRef.current.select();
      } else if (
        this.state.error.tagList &&
        this.state.error.tagList[0] &&
        this.tagListInputRef.current
      ) {
        this.tagListInputRef.current.select();
      } else if (this.titleInputRef.current) {
        this.titleInputRef.current.select();
      }
    } else if (this.titleInputRef.current) {
      this.titleInputRef.current.select();
    }
  }

  handleTitleChange = (title: string) => {
    this.setState({ title });
  };

  handleDescriptionChange = (description: string) => {
    this.setState({ description });
  };

  handleBodyChange = (body: string) => {
    this.setState({ body });
  };

  handleTagListChange = (tagList: string) => {
    this.setState({ tagList });
  };

  handleSubmit = () => {
    this.setState({
      submitting: true,
      error: { type: "none" }
    });

    this.props
      .createArticle(this.props.currentUser.token, {
        title: this.state.title,
        description: this.state.description,
        body: this.state.body,
        tagList: this.state.tagList.split(" ").filter(tag => tag !== "")
      })
      .then(
        result => {
          if (result.isOk) {
            navigate(`/article/${encodeURIComponent(result.article.slug)}`);
          } else {
            this.setState(
              {
                submitting: false,
                error: {
                  type: "fields",
                  ...result.errors
                }
              },
              () => this.focusFirstInvalidInput()
            );
          }
        },
        () => {
          this.setState(
            {
              submitting: false,
              error: { type: "network" }
            },
            () => this.focusFirstInvalidInput()
          );
        }
      );
  };

  render() {
    return (
      <div className={cn("container", "mh-auto")}>
        <h1 className={cn("f2", "normal", "near-black", "tc", "mv4")}>
          New Article
        </h1>

        <div className={cn("w-80", "mh-auto")}>
          <Form testId="new-article-form" onSubmit={this.handleSubmit}>
            <GlobalError>
              {this.state.error.type === "network" ? "An error occurred" : null}
            </GlobalError>

            <TextInput
              id="title"
              testId="new-article-title"
              inputRef={this.titleInputRef}
              type="text"
              label="Title"
              value={this.state.title}
              onChange={this.handleTitleChange}
              disabled={this.state.submitting}
              error={
                this.state.error.type === "fields" && this.state.error.title
                  ? this.state.error.title[0]
                  : undefined
              }
            />

            <TextInput
              id="description"
              testId="new-article-description"
              inputRef={this.descriptionInputRef}
              type="text"
              label="What's this article about?"
              value={this.state.description}
              onChange={this.handleDescriptionChange}
              disabled={this.state.submitting}
              error={
                this.state.error.type === "fields" &&
                this.state.error.description
                  ? this.state.error.description[0]
                  : undefined
              }
            />

            <TextArea
              id="body"
              testId="new-article-body"
              textAreaRef={this.bodyInputRef}
              label="Write your article (in markdown)"
              value={this.state.body}
              onChange={this.handleBodyChange}
              disabled={this.state.submitting}
              error={
                this.state.error.type === "fields" && this.state.error.body
                  ? this.state.error.body[0]
                  : undefined
              }
            />

            <TextInput
              id="tag-list"
              testId="new-article-tag-list"
              inputRef={this.tagListInputRef}
              type="text"
              label="Enter tags"
              value={this.state.tagList}
              onChange={this.handleTagListChange}
              disabled={this.state.submitting}
              error={
                this.state.error.type === "fields" && this.state.error.tagList
                  ? this.state.error.tagList[0]
                  : undefined
              }
            />

            <Submit
              text="Publish Article"
              disabled={
                this.state.submitting ||
                this.state.title === "" ||
                this.state.description === "" ||
                this.state.body === ""
              }
            />
          </Form>
        </div>
      </div>
    );
  }
}

export default NewArticle;
