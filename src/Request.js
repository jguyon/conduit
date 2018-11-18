// @flow

import * as React from "react";

class CanceledError extends Error {
  constructor() {
    super("promise was canceled");
  }
}

const makeCancelable = <T>(promise: Promise<T>): [Promise<T>, () => void] => {
  let canceled = false;

  return [
    new Promise((resolve, reject) => {
      promise.then(
        value => (canceled ? reject(new CanceledError()) : resolve(value)),
        error => (canceled ? reject(new CanceledError()) : reject(error))
      );
    }),
    () => {
      canceled = true;
    }
  ];
};

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

  cancel = () => {};

  load() {
    const [promise, cancel] = makeCancelable(this.props.load());

    this.cancel = cancel;

    this.setState({
      request: {
        status: "pending"
      }
    });

    promise.then(
      data =>
        this.setState({
          request: {
            status: "success",
            data
          }
        }),
      error =>
        error instanceof CanceledError
          ? undefined
          : this.setState({
              request: {
                status: "error",
                error
              }
            })
    );
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps: RequestProps<T>) {
    const nextProps = this.props;

    if (nextProps.load !== prevProps.load) {
      this.cancel();
      this.load();
    }
  }

  componentWillUnmount() {
    this.cancel();
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
