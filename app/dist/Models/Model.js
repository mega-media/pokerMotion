/**
 * Created by arShown on 2016/6/7.
 */

"use strict";
import CookiesLibrary from '../Libraries/CookiesLibrary';
import SessionStorageLibrary from '../Libraries/SessionStorageLibrary';

export default class Model {
  constructor(KEY) {
    if (typeof KEY !== "string") {
      throw new Error("[Model]key type error : " + typeof KEY);
    }
    this.storageKey = KEY;
    this.lib = (typeof(Storage) !== "undefined") ? SessionStorageLibrary.register(this.storageKey) : CookiesLibrary.register(this.storageKey);
  }

  get(...args) {
    return this.lib.get(...args);
  }

  set(...args) {
    return this.lib.set(...args);
  }

  remove(...args) {
    return this.lib.remove(...args);
  }

  clear(...args) {
    return this.lib.clear(...args);
  }

  exists(...args) {
    return this.lib.exists(...args);
  }

  length(...args) {
    return this.lib.length(...args);
  }
}
