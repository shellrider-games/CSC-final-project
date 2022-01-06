export function randomNumberBetween(minRandomNumber, maxRandomNumber) {
  return Math.floor(
    Math.random() * (maxRandomNumber - minRandomNumber + 1) + minRandomNumber
  );
}
