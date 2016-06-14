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
  }
};
export default unitLibrary;
