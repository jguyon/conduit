// @flow

import * as React from "react";
import ArticleFeed from "./article-feed";
import PopularTags from "./popular-tags";
import { StyledBanner, StyledContainer } from "./styles";
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

  handleTagClick = (tag: string) => {
    this.setState({
      page: 1,
      route: {
        type: "tag",
        tag
      }
    });
  };

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

          <PopularTags
            activeTag={
              this.state.route.type === "tag" ? this.state.route.tag : null
            }
            onTagClick={this.handleTagClick}
          />
        </StyledContainer>
      </>
    );
  }
}

export default Home;
