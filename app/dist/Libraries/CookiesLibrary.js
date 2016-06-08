/**
 * Created by arShown on 2016/6/7.
 */
"use strict";

class CookiesLibrary {
  constructor(KEY) {
  }

  set() {
  }

  get() {
  }

  remove() {
  }

  clear() {
  }

  exists() {
  }

  length() {
  }
}

export var Methods =
{
  LIB: {},
  register: function (KEY) {
    this.LIB = new CookiesLibrary(KEY);
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
