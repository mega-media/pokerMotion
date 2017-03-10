/**
 * 兩點的計算
 * Created by arShown on 2016/6/14.
 * Updated on 2017/3/8.
 */

export function zeroThrow(numerator:number, denominator:number):number {
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
export function slopeBetweenPoints(x1:number, x2:number, y1:number, y2:number):number {
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
export function unSlopeBetweenPoints(x1:number, x2:number, y1:number, y2:number):number {
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
export function middleBetweenPoints(x1:number, x2:number, y1:number, y2:number):{x: number, y: number} {
    const x = zeroThrow((x1 + x2), 2);
    const y = zeroThrow((y1 + y2), 2);
    return {x, y};
}

/**
 * 兩點間形成的三角形雙邊
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 * @returns {{sizeLeft: Number, sizeRight: Number}}
 */
export function sizeBetweenPoints(x1:number, x2:number, y1:number, y2:number):{sizeLeft: number, sizeRight: number} {
    const mK = Math.abs(parseFloat(x2 - x1));
    const mL = Math.abs(parseFloat(y2 - y1));
    const temp = parseFloat(Math.pow(mL, 2) + Math.pow(mK, 2));
    const sizeLeft = zeroThrow(temp, (2 * mK));
    const sizeRight = zeroThrow(temp, (2 * mL));
    return {sizeLeft, sizeRight};
}

/**
 * 兩點之間的距離
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 */
export function distanceBetweenPoints(x1:number, x2:number, y1:number, y2:number):number {
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
export function angleBetweenPoints(x1:number, x2:number, y1:number, y2:number):number {
    return zeroThrow(Math.atan2(y1 - y2, x1 - x2), Math.PI) * 180;
}

/**
 * 兩線相交的座標
 * https://www.ptt.cc/bbs/Flash/M.1201264066.A.40B.html
 * 直線方程式 ： ax + by = c
 * @param a1
 * @param b1
 * @param c1
 * @param a2
 * @param b2
 * @param c2
 * @returns {point[x,y]}
 */
export function getIntersectPosition(a1:number, b1:number, c1:number, a2:number, b2:number, c2:number):Array<number> {
    return [zeroThrow((c1 * b2 - c2 * b1), (a1 * b2 - a2 * b1)), zeroThrow((c1 * a2 - c2 * a1), ( -1 * a1 * b2 + a2 * b1))];
}

/**
 * 兩點座標，回傳對稱點座標函式
 * http://sites.ccvs.kh.edu.tw/fuchi/doc/26261
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 * @returns {Function:(x,y)=>{mirrorX: number, mirrorY: number}}
 * newX = x - 2 * a * (ax + by + c) / (a^2 + b^2);
 * newY = y - 2 * b * (ax + by + c) / (a^2 + b^2);
 */
export function getMirrorPosition(x1:number, x2:number, y1:number, y2:number):(x:number, y:number) => {mirrorX: number, mirrorY: number} {
    const middlePoint = middleBetweenPoints(x1, x2, y1, y2);
    const unSlope = unSlopeBetweenPoints(x1, x2, y1, y2);

    /* 對稱線的直線方程式 */
    const c = middlePoint.y - unSlope * middlePoint.x;

    return function (x, y) {
        const Func = (x, y) => zeroThrow((unSlope * x - y + c), parseFloat(Math.pow(unSlope, 2) + Math.pow(-1, 2)));
        const mirrorX = x - 2 * unSlope * Func(x, y);
        const mirrorY = y - 2 * -1 * Func(x, y);
        return {mirrorX, mirrorY};
    }
}

