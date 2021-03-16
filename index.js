const axios = require("axios");

const run = async () => {
  // schedule all tasks
  const tasks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const cancellableResults = tasks.map((t) => {
    return getData();
  });
  console.log("just scheduled all of the tasks");

  // set a timeout
  setTimeout(() => {
    console.log("cancelling all outstanding requests");
    cancellableResults.forEach((cr) => cr.cancelTokenSource.cancel());
  }, 1800);

  // wait for responses
  const results = await Promise.all(cancellableResults.map((cr) => cr.promise));
  console.log("Finished waiting");

  // how many requests succeeded?
  const succeeded = results.filter((r) => Boolean(r));
  console.log(succeeded.length, " requests succeeded");

  // how many got cancelled?
  const cancelled = results.filter((r) => !Boolean(r));
  console.log(cancelled.length, " requests cancelled");
};

const getData = () => {
  const source = axios.CancelToken.source();
  const start = new Date();

  const promise = axios
    .get("https://swapi.dev/api/people/1", {
      cancelToken: source.token,
    })
    .then((r) => {
      console.log("success!");
      return r.data;
    })
    .catch((e) => {
      console.log("error occurred when getting data ", e);
    })
    .finally(() => {
      console.log("elapsed ", new Date() - start, "ms");
    });

  return {
    promise,
    cancelTokenSource: source,
  };
};

run();
