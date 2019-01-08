// @flow

import * as React from "react";
import { makeCancelable, CanceledError } from "../lib/makeCancelable";

export type RequestData<T> =
  | {|
      status: "pending"
    |}
  | {|
      status: "error",
      error: mixed
    |}
  | {|
      status: "success",
      data: T
    |};

type RequestProps<T> = {|
  load: () => Promise<T>,
  children: (RequestData<T>) => React.Node
|};

type RequestState<T> = {|
  request: RequestData<T>
|};

class Request<T> extends React.Component<RequestProps<T>, RequestState<T>> {
  state: RequestState<T> = {
    request: {
      status: "pending"
    }
  };

  cancel: ?() => void = null;

  load() {
    if (this.cancel) {
      this.cancel();
    }

    const [promise, cancel] = makeCancelable(this.props.load());

    this.cancel = cancel;

    this.setState({
      request: {
        status: "pending"
      }
    });

    promise.then(
      data => {
        this.cancel = null;

        this.setState({
          request: {
            status: "success",
            data
          }
        });
      },
      error => {
        if (!(error instanceof CanceledError)) {
          this.cancel = null;

          this.setState({
            request: {
              status: "error",
              error
            }
          });
        }
      }
    );
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps: RequestProps<T>) {
    const nextProps = this.props;

    if (nextProps.load !== prevProps.load) {
      this.load();
    }
  }

  componentWillUnmount() {
    if (this.cancel) {
      this.cancel();
    }
  }

  shouldComponentUpdate(
    nextProps: RequestProps<T>,
    nextState: RequestState<T>
  ) {
    const prevProps = this.props;
    const prevState = this.state;

    return (
      prevProps.load !== nextProps.load ||
      prevProps.children !== nextProps.children ||
      prevState.request.status !== nextState.request.status
    );
  }

  render() {
    return this.props.children(this.state.request);
  }
}

export default Request;
