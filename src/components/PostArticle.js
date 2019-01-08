// @flow

import * as React from "react";
import { navigate } from "@reach/router";
import cn from "classnames";
import { Form, GlobalError, TextInput, TextArea, Submit } from "./Form";
import Request from "./Request";
import NotFound from "./NotFound";
import * as api from "../lib/api";

type PostArticlePageProps = {|
  header: string,
  onSubmit?: () => void,
  submitDisabled: boolean,
  globalError?: string,
  title: {|
    value: string,
    onChange?: string => void,
    disabled: boolean,
    error?: string,
    inputRef?: { current: null | HTMLInputElement }
  |},
  description: {|
    value: string,
    onChange?: string => void,
    disabled: boolean,
    error?: string,
    inputRef?: { current: null | HTMLInputElement }
  |},
  body: {|
    value: string,
    onChange?: string => void,
    disabled: boolean,
    error?: string,
    inputRef?: { current: null | HTMLTextAreaElement }
  |},
  tagList: {|
    value: string,
    onChange?: string => void,
    disabled: boolean,
    error?: string,
    inputRef?: { current: null | HTMLInputElement }
  |}
|};

const PostArticlePage = (props: PostArticlePageProps) => (
  <div className={cn("container", "mh-auto")}>
    <h1 className={cn("f2", "normal", "near-black", "tc", "mv4")}>
      {props.header}
    </h1>

    <div className={cn("w-80", "mh-auto")}>
      <Form testId="post-article-form" onSubmit={props.onSubmit}>
        <GlobalError>{props.globalError}</GlobalError>

        <TextInput
          id="title"
          testId="post-article-title"
          inputRef={props.title.inputRef}
          type="text"
          label="Title"
          value={props.title.value}
          onChange={props.title.onChange}
          disabled={props.title.disabled}
          error={props.title.error}
        />

        <TextInput
          id="description"
          testId="post-article-description"
          inputRef={props.description.inputRef}
          type="text"
          label="What's this article about?"
          value={props.description.value}
          onChange={props.description.onChange}
          disabled={props.description.disabled}
          error={props.description.error}
        />

        <TextArea
          id="body"
          testId="post-article-body"
          textAreaRef={props.body.inputRef}
          label="Write your article (in markdown)"
          value={props.body.value}
          onChange={props.body.onChange}
          disabled={props.body.disabled}
          error={props.body.error}
        />

        <TextInput
          id="tag-list"
          testId="post-article-tag-list"
          inputRef={props.tagList.inputRef}
          type="text"
          label="Enter tags"
          value={props.tagList.value}
          onChange={props.tagList.onChange}
          disabled={props.tagList.disabled}
          error={props.tagList.error}
        />

        <Submit text="Publish Article" disabled={props.submitDisabled} />
      </Form>
    </div>
  </div>
);

type PostArticlePlaceholderProps = {|
  title: string
|};

const PostArticlePlaceholder = (props: PostArticlePlaceholderProps) => (
  <PostArticlePage
    header={props.title}
    submitDisabled
    title={{ value: "", disabled: true }}
    description={{ value: "", disabled: true }}
    body={{ value: "", disabled: true }}
    tagList={{ value: "", disabled: true }}
  />
);

type PostArticleFields = {|
  title: string,
  description: string,
  body: string,
  tagList: string[]
|};

type PostArticleResult =
  | {|
      isOk: true,
      article: api.Article
    |}
  | {|
      isOk: false,
      errors: {
        title?: string[],
        description?: string[],
        body?: string[],
        tagList?: string[]
      }
    |};

type PostArticleFormProps = {|
  postArticle: PostArticleFields => Promise<PostArticleResult>,
  initialFields: PostArticleFields,
  title: string
|};

type PostArticleFormState = {|
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

class PostArticleForm extends React.Component<
  PostArticleFormProps,
  PostArticleFormState
> {
  state = {
    submitting: false,
    error: { type: "none" },
    title: this.props.initialFields.title,
    description: this.props.initialFields.description,
    body: this.props.initialFields.body,
    tagList: this.props.initialFields.tagList.join(" ")
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
      .postArticle({
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
      <PostArticlePage
        header={this.props.title}
        onSubmit={this.handleSubmit}
        submitDisabled={
          this.state.submitting ||
          this.state.title === "" ||
          this.state.description === "" ||
          this.state.body === ""
        }
        title={{
          inputRef: this.titleInputRef,
          value: this.state.title,
          onChange: this.handleTitleChange,
          disabled: this.state.submitting,
          error:
            this.state.error.type === "fields" && this.state.error.title
              ? this.state.error.title[0]
              : undefined
        }}
        description={{
          inputRef: this.descriptionInputRef,
          value: this.state.description,
          onChange: this.handleDescriptionChange,
          disabled: this.state.submitting,
          error:
            this.state.error.type === "fields" && this.state.error.description
              ? this.state.error.description[0]
              : undefined
        }}
        body={{
          inputRef: this.bodyInputRef,
          value: this.state.body,
          onChange: this.handleBodyChange,
          disabled: this.state.submitting,
          error:
            this.state.error.type === "fields" && this.state.error.body
              ? this.state.error.body[0]
              : undefined
        }}
        tagList={{
          inputRef: this.tagListInputRef,
          value: this.state.tagList,
          onChange: this.handleTagListChange,
          disabled: this.state.submitting,
          error:
            this.state.error.type === "fields" && this.state.error.tagList
              ? this.state.error.tagList[0]
              : undefined
        }}
      />
    );
  }
}

type PostArticleProps =
  | {|
      type: "create",
      currentUser: api.User
    |}
  | {|
      type: "update",
      currentUser: api.User,
      slug: string
    |};

const PostArticle = (props: PostArticleProps) => {
  const token = props.currentUser.token;

  switch (props.type) {
    case "create":
      return (
        <PostArticleForm
          title="New Article"
          postArticle={fields => api.createArticle({ ...fields, token })}
          initialFields={{
            title: "",
            description: "",
            body: "",
            tagList: []
          }}
        />
      );

    case "update":
      const { slug } = props;

      return (
        <Request load={() => api.getArticle({ slug })}>
          {request => {
            switch (request.status) {
              case "pending":
                return <PostArticlePlaceholder title="Edit Article" />;

              case "error":
                return <NotFound />;

              case "success":
                const article = request.data;

                return (
                  <PostArticleForm
                    title="Edit Article"
                    postArticle={fields =>
                      api.updateArticle({ ...fields, token, slug })
                    }
                    initialFields={{
                      title: article.title,
                      description: article.description,
                      body: article.body,
                      tagList: article.tagList
                    }}
                  />
                );

              default:
                throw new Error("invalid status");
            }
          }}
        </Request>
      );

    default:
      throw new Error("invalid type");
  }
};

export default PostArticle;
