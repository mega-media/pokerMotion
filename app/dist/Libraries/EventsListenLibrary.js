/**
 * Created by arShown on 2016/6/8.
 */
"use strict";

var EventsListenLibrary = {
  addListener(key, eventName, callbacks) {
    window.addEventListener(eventName, function (e) {
      if (e.detail === key) {
        callbacks();
      }
    }.bind(this));
  },
  dispatchEvent(key, eventName) {
    var event = new CustomEvent(eventName, {'detail': key});
    window.dispatchEvent(event);
  }
};
export default EventsListenLibrary;
