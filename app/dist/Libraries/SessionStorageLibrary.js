/**
 * Created by arShown on 2016/6/7.
 */
"use strict";
class SessionStorageLibrary {
  constructor(KEY) {
    if (typeof KEY !== "string") {
      throw new Error("[SessionStroageLibrary]key type error : " + typeof KEY);
    }
    this.KEY = KEY;
    if(typeof sessionStorage[this.KEY] === "undefined")
    {
      sessionStorage.setItem(this.KEY, JSON.stringify({}));
    }
  }

  _fetch()
  {
    try {
      JSON.parse(sessionStorage[this.KEY]);
    } catch (e) {
      console.log("storage format error.",sessionStorage[this.KEY]);
      sessionStorage.setItem(this.KEY, JSON.stringify({}));
    }
    return JSON.parse(sessionStorage[this.KEY]);
  }

  /**
   * :+:+: use :+:+:
   * set(key,value1,value2,...)  => { key : { 0 : value1, 1 : value2, ...}}
   * set({key : value, key2 : value2 , ....})
   * @returns {SessionStorageLibrary}
   */
  set() {
    if (typeof arguments[0] === "undefined") {
      throw new Error("[SessionStroageLibrary]set first params type error : " + typeof arguments[0]);
    }
    var obj = {};
    if (typeof arguments[0] === "object") {
      obj = arguments[0];
    }
    if (arguments.length >= 2 && typeof arguments[0] === "string") {
      if (arguments[0] == "" || arguments[0] == null) {
        throw new Error("[SessionStroageLibrary]set 第一個參數不能為空！");
      }
      if (arguments.length == 2) {
        obj[arguments[0]] = arguments[1];
      } else {
        obj[arguments[0]] = Array.from(arguments).reduce((returnObj, value, index) => {
          if (index == 0) {
            return returnObj;
          }
          returnObj[index - 1] = value ;
          return returnObj;
        }, {});
      }
    }
    sessionStorage.setItem(this.KEY, JSON.stringify(Object.assign({}, this._fetch(), obj)));
    return this;
  }

  /**
   * :+:+: use :+:+:
   * get() 無傳入參數，回傳所有資料內容
   * get(key) 傳入單一值，回傳該值資料
   * get(key1,key2,...) 傳入多數值，回傳 {key1:value1,key2:value2,...}
   * @returns {string | object}
   */
  get() {
    if (arguments.length == 0) {
      return this._fetch();
    }
    var modelData = this._fetch();
    if (arguments.length == 1) {
      return modelData[arguments[0]];
    }
    return Array.from(arguments).reduce((returnObj, value) => {
      returnObj[value] = modelData[value];
      return returnObj;
    }, {});
  }

  /**
   * :+:+: use :+:+:
   * remove(key1,key2,...)
   * @returns {SessionStorageLibrary}
   */
  remove() {
    if (arguments.length > 0) {
      var modelData = this._fetch();
      sessionStorage.setItem(this.KEY, JSON.stringify(Object.keys(modelData).filter(key => Array.from(arguments).indexOf(key) == -1).reduce((returnObj, key) => {
        returnObj[key] = modelData[key];
        return returnObj;
      }, {})));
    }
    return this;
  }

  /**
   * 清空
   * @returns {SessionStorageLibrary}
   */
  clear() {
    sessionStorage.removeItem(this.KEY);
    return this;
  }

  /**
   * 判斷key是否有value
   * :+:+: use :+:+:
   * exists(key1) 查單一key 回傳 true | false
   * exists(key1,key2,...) => { key1 : true , key2 : false , ... }
   * @returns {boolean | object}
   */
  exists() {
    var modelData = this._fetch();
    if (arguments.length == 1) {
      if (Object.keys(modelData).indexOf(arguments[0]) > -1) {
        return true;
      }
      return false;
    }
    return Array.from(arguments).reduce((returnObj, value) => {
      returnObj[value] = (Object.keys(modelData).indexOf(value) > -1) ? true : false;
      return returnObj;
    }, {});
  }

  /**
   * 資料筆數
   * @returns {Number}
   */
  length() {
    return Object.keys(this._fetch()).length;
  }

}

var Methods =
{
  LIB: {},
  register: function (KEY) {
    this.LIB = new SessionStorageLibrary(KEY);
    return this;
  },
  get: function (...args) {
    return this.LIB.get(...args);
  },
  set: function (...args) {
    return this.LIB.set(...args);
  },
  remove: function (...args) {
    return this.LIB.remove(...args);
  },
  clear: function (...args) {
    return this.LIB.clear(...args);
  },
  exists: function (...args) {
    return this.LIB.exists(...args);
  },
  length: function (...args) {
    return this.LIB.length(...args);
  }
};

export default Methods;
