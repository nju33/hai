export function px(num) {
  if (typeof num !== 'number') {
    throw Error('Not a number');
  }
  return `${num}px`;
}
