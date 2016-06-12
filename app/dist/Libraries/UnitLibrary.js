/**
 * Created by arShown on 2016/6/8.
 */
"use strict";
var unitLibrary =
{
  makePrimaryKey()
  {
    return Math.random().toString(36).substring(8);
  },
  objectToArray(obj)
  {
    return Object.keys(obj).reduce((returnObj, value, index) => {
      returnObj.push(obj[index]);
      return returnObj;
    }, []);
  },

  /** 兩點之間的計算 **/

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
  }

};
export default unitLibrary;
