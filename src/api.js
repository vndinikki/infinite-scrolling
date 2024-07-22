export function getContent(offset, batchSize = 20) {
  let arr = [];
  for (var i = offset; i < offset + batchSize; i++) {
    arr.push(i);
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(arr);
    }, Math.random() * 2000);
  });
}
