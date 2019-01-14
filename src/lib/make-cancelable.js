// @flow

export class CanceledError extends Error {
  constructor() {
    super("promise was canceled");
  }
}

export const makeCancelable = <T>(
  promise: Promise<T>
): [Promise<T>, () => void] => {
  let canceled = false;

  const cancelablePromise = new Promise((resolve, reject) => {
    promise.then(
      value => (canceled ? reject(new CanceledError()) : resolve(value)),
      error => (canceled ? reject(new CanceledError()) : reject(error))
    );
  });

  const cancel = () => {
    canceled = true;
  };

  return [cancelablePromise, cancel];
};

export const noopCancel = () => {};
