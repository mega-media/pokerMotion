/**
 * 兩點之間的計算
 * Created by arShown on 2016/6/14.
 */
"use strict";
var pointsLibrary =
{
  /**
   * 兩點斜率
   * @param x1
   * @param x2
   * @param y1
   * @param y2
   * @returns {Number}
   */
  slopeBetweenPoints(x1, x2, y1, y2)
  {
    return parseFloat((y2 - y1) / (x2 - x1));
  },

  /**
   * 兩點垂直線的斜率
   * @param x1
   * @param x2
   * @param y1
   * @param y2
   * @returns {number}
   */
  unSlopeBetweenPoints(x1, x2, y1, y2)
  {
    return parseFloat( (x2 - x1) / (y2 - y1) ) * -1;
  },

  /**
   * 兩點中點
   * @param x1
   * @param x2
   * @param y1
   * @param y2
   * @returns {{x: Number, y: Number}}
   */
  middleBetweenPoints(x1, x2, y1, y2)
  {
    var x = parseFloat((x1 + x2) / 2);
    var y = parseFloat((y1 + y2) / 2);
    return {x, y};
  },

  /**
   * 兩點間形成的三角形雙邊
   * @param x1
   * @param x2
   * @param y1
   * @param y2
   * @returns {{sizeLeft: Number, sizeRight: Number}}
   */
  sizeBetweenPoints(x1, x2, y1, y2)
  {
    var mK = Math.abs(parseFloat(x2 - x1));
    var mL = Math.abs(parseFloat(y2 - y1));
    var temp = parseFloat(Math.pow(mL, 2) + Math.pow(mK, 2));
    var sizeLeft = parseFloat(temp / (2 * mK));
    var sizeRight = parseFloat(temp / (2 * mL));
    return {sizeLeft, sizeRight};
  },

  /**
   * 兩點之間的距離
   * @param x1
   * @param x2
   * @param y1
   * @param y2
   */
  distanceBetweenPoints(x1, x2, y1, y2)
  {
    return Math.abs(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
  },

  /**
   * 兩點之間旋轉角度
   * @param x1
   * @param x2
   * @param y1
   * @param y2
   * @returns {number}
   */
  angleBetweenPoints(x1, x2, y1, y2) {
    return Math.atan2(y1 - y2, x1 - x2) / Math.PI * 180;
  },

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
  getIntersectPosition(a1, b1, c1, a2, b2, c2) {
    return [(c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1), (c1 * a2 - c2 * a1) / ( -1 * a1 * b2 + a2 * b1)];
  },

  /**
   * 由兩點取得直線方程式
   * @param x1
   * @param x2
   * @param y1
   * @param y2
   * @returns {Function}
   */
  theVerticalLineFuc(x1,x2,y1,y2)
  {
    var middlePoint = this.middleBetweenPoints(x1, x2, y1,y2);
    var unSlope = this.unSlopeBetweenPoints(x1, x2, y1,y2);
    return function (x, y)
    {
      return (unSlope * x - y + ( middlePoint.y - unSlope * middlePoint.x)) / parseFloat(Math.pow(unSlope, 2) + Math.pow(-1, 2));
    };
  },

  /**
   * 取得目標座標的對稱點座標
   * http://sites.ccvs.kh.edu.tw/fuchi/doc/26261
   * @param x 目標座標.x
   * @param y 目標座標.y
   * @param unSlope 斜率
   * @param Fuc 直線方程式
   * @returns {{mirrorX: number, mirrorY: number}}
   */
  getMirrorPosition(x, y, unSlope, Fuc)
  {
    var mirrorX = x - 2 * unSlope * Fuc(x, y);
    var mirrorY = y - 2 * -1 * Fuc(x, y);
    return {mirrorX, mirrorY};
  }

};
export default pointsLibrary;
