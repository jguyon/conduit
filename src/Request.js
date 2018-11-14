// @flow

import * as React from "react";

export type RequestData<T> =
  | {|
      status: "pending",
      promise?: Promise<T>
    |}
  | {|
      status: "error",
      error: any
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

  load() {
    const promise = this.props.load();

    this.setState({
      request: {
        status: "pending",
        promise
      }
    });

    promise.then(
      data =>
        this.setState(
          ({ request }) =>
            request.status === "pending" && request.promise === promise
              ? {
                  request: {
                    status: "success",
                    data
                  }
                }
              : null
        ),
      error =>
        this.setState(
          ({ request }) =>
            request.status === "pending" && request.promise === promise
              ? {
                  request: {
                    status: "error",
                    error
                  }
                }
              : null
        )
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
