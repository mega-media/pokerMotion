/**
 * 兩點的計算
 */
export function zeroThrow(numerator, denominator) {
  return numerator === 0 || denominator === 0 ? 0 : parseFloat(numerator / denominator);
}

/**
 * 兩點斜率
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 * @returns {Number}
 */
export function slopeBetweenPoints(x1, x2, y1, y2) {
  return zeroThrow(y2 - y1, x2 - x1);
}

/**
 * 兩點垂直線的斜率
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 * @returns {number}
 */
export function unSlopeBetweenPoints(x1, x2, y1, y2) {
  return zeroThrow(-1, slopeBetweenPoints(x1, x2, y1, y2));
}

/**
 * 兩點中點
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 * @returns {{x: Number, y: Number}}
 */
export function middleBetweenPoints(x1, x2, y1, y2) {
  const x = zeroThrow((x1 + x2), 2);
  const y = zeroThrow((y1 + y2), 2);
  return { x, y };
}

/**
 * 兩點之間的距離
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 */
export function distanceBetweenPoints(x1, x2, y1, y2) {
  return Math.abs(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
}

/**
 * 兩點之間旋轉角度
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 * @returns {number}
 */
export function angleBetweenPoints(x1, x2, y1, y2) {
  if (x1 === x2 && y1 >= y2) return 0;
  x2 -= x1;
  y2 -= y1;

  const magnitude = Math.sqrt(((x2 * x2) + (y2 * y2)));
  const angle = Math.acos(-y2 / magnitude) * (180 / Math.PI);

  return (x2 < 0 ? -angle : angle);
}
