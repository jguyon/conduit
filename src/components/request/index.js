// @flow

import * as React from "react";
import {
  makeCancelable,
  CanceledError,
  noopCancel
} from "../../lib/make-cancelable";

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
  load: () => Promise<T>,
  request: RequestData<T>
|};

class Request<T> extends React.Component<RequestProps<T>, RequestState<T>> {
  state: RequestState<T> = {
    load: this.props.load,
    request: {
      status: "pending"
    }
  };

  static getDerivedStateFromProps(
    props: RequestProps<T>,
    state: RequestState<T>
  ): RequestState<T> | null {
    if (props.load !== state.load) {
      return {
        load: props.load,
        request: {
          status: "pending"
        }
      };
    } else {
      return null;
    }
  }

  cancel = noopCancel;

  load() {
    this.cancel();

    const [promise, cancel] = makeCancelable(this.state.load());

    this.cancel = cancel;

    promise.then(
      data => {
        this.setState({
          request: {
            status: "success",
            data
          }
        });
      },
      error => {
        if (!(error instanceof CanceledError)) {
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

  componentDidUpdate(_prevProps: RequestProps<T>, prevState: RequestState<T>) {
    const nextState = this.state;

    if (nextState.load !== prevState.load) {
      this.load();
    }
  }

  componentWillUnmount() {
    this.cancel();
  }

  render() {
    return this.props.children(this.state.request);
  }
}

export default Request;
