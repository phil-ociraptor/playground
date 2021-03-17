const axios = require("axios");

const run = async () => {
  // schedule all tasks
  const tasks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const source = axios.CancelToken.source();
  const promises = tasks.map((t) => {
    return getData(source);
  });
  console.log("just scheduled all of the tasks");

  // set a timeout
  setTimeout(() => {
    console.log("cancelling all outstanding requests");
    source.cancel({ to: "Daniel", from: "Anon" });
  }, 1800);

  // wait for responses
  const results = await Promise.all(promises);
  console.log("Finished waiting");

  // how many requests succeeded?
  const succeeded = results.filter((r) => Boolean(r));
  console.log(succeeded.length, " requests succeeded");

  // how many got cancelled?
  const cancelled = results.filter((r) => !Boolean(r));
  console.log(cancelled.length, " requests cancelled");
};

const getData = (inputSource) => {
  const source = inputSource || axios.CancelToken.source();
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
      // Note the return of this is implicity undefined
    })
    .finally(() => {
      console.log("elapsed ", new Date() - start, "ms");
    });
  return promise;
};

run();
