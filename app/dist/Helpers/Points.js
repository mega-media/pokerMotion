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
    return zeroThrow(x2 - x1, y2 - y1) * -1;
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
    var x = zeroThrow((x1 + x2), 2);
    var y = zeroThrow((y1 + y2), 2);
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
    var mK = Math.abs(parseFloat(x2 - x1));
    var mL = Math.abs(parseFloat(y2 - y1));
    var temp = parseFloat(Math.pow(mL, 2) + Math.pow(mK, 2));
    var sizeLeft = zeroThrow(temp, (2 * mK));
    var sizeRight = zeroThrow(temp, (2 * mL));
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
 * 由兩點取得直線方程式
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 * @returns {Function}
 */
export function theVerticalLineFuc(x1:number, x2:number, y1:number, y2:number):(x:number, y:number) => number {
    var middlePoint = middleBetweenPoints(x1, x2, y1, y2);
    var unSlope = unSlopeBetweenPoints(x1, x2, y1, y2);
    return function (x, y) {
        return zeroThrow((unSlope * x - y + ( middlePoint.y - unSlope * middlePoint.x)), parseFloat(Math.pow(unSlope, 2) + Math.pow(-1, 2)));
    };
}

/**
 * 取得目標座標的對稱點座標
 * http://sites.ccvs.kh.edu.tw/fuchi/doc/26261
 * @param x 目標座標.x
 * @param y 目標座標.y
 * @param unSlope 斜率
 * @param Fuc 直線方程式
 * @returns {{mirrorX: number, mirrorY: number}}
 */
export function getMirrorPosition(x:number, y:number, unSlope:number, Fuc:(x:number, y:number)=>number):{mirrorX: number, mirrorY: number} {
    var mirrorX = x - 2 * unSlope * Fuc(x, y);
    var mirrorY = y - 2 * -1 * Fuc(x, y);
    return {mirrorX, mirrorY};
}

