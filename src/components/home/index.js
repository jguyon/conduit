// @flow

import * as React from "react";
import Request from "../request";
import type { RequestData } from "../request";
import ArticleFeed from "./article-feed";
import {
  StyledBanner,
  StyledContainer,
  StyledContainerAside,
  StyledTags,
  StyledTagItem,
  StyledTagLoadingError
} from "./styles";
import * as api from "../../lib/api";

type HomeProps = {|
  currentUser: ?api.User
|};

type HomeState = {|
  page: number,
  route:
    | {| type: "global" |}
    | {|
        type: "my",
        token: string
      |}
    | {|
        type: "tag",
        tag: string
      |}
|};

class Home extends React.Component<HomeProps, HomeState> {
  focusRef = React.createRef<HTMLDivElement>();

  state = {
    page: 1,
    route: this.props.currentUser
      ? { type: "my", token: this.props.currentUser.token }
      : { type: "global" }
  };

  setPage = (page: number) => {
    this.setState({ page });
  };

  handleGlobalFeedClick = () => {
    this.setState({
      page: 1,
      route: { type: "global" }
    });
  };

  handleMyFeedClick = () => {
    if (this.props.currentUser) {
      this.setState({
        page: 1,
        route: {
          type: "my",
          token: this.props.currentUser.token
        }
      });
    }
  };

  handleTagClick(tag: string) {
    return () =>
      this.setState({
        page: 1,
        route: {
          type: "tag",
          tag
        }
      });
  }

  componentDidUpdate(_prevProps: HomeProps, prevState: HomeState) {
    const nextState = this.state;

    if (
      this.focusRef.current &&
      (nextState.page !== prevState.page || nextState.route !== prevState.route)
    ) {
      this.focusRef.current.focus();
    }
  }

  render() {
    return (
      <>
        <StyledBanner />

        <StyledContainer ref={this.focusRef}>
          <ArticleFeed
            currentUser={this.props.currentUser}
            page={this.state.page}
            route={this.state.route}
            setPage={this.setPage}
            onGlobalFeedClick={this.handleGlobalFeedClick}
            onMyFeedClick={this.handleMyFeedClick}
          />

          <StyledContainerAside>
            <StyledTags>
              <Request load={api.listTags}>{this.renderTags}</Request>
            </StyledTags>
          </StyledContainerAside>
        </StyledContainer>
      </>
    );
  }

  renderTags = (request: RequestData<string[]>): React.Node => {
    switch (request.status) {
      case "pending":
        return (
          <>
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={2} />
            <StyledTagItem placeholder size={4} />
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={2} />
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={2} />
            <StyledTagItem placeholder size={4} />
            <StyledTagItem placeholder size={2} />
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={3} />
            <StyledTagItem placeholder size={4} />
            <StyledTagItem placeholder size={3} />
          </>
        );

      case "error":
        return <StyledTagLoadingError />;

      case "success":
        const tags = request.data;

        return tags.map(tag => (
          <StyledTagItem
            key={tag}
            name={tag}
            testId={`tag-${tag}`}
            onClick={this.handleTagClick(tag)}
          />
        ));

      default:
        throw new Error("invalid status");
    }
  };
}

export default Home;
