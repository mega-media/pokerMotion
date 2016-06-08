/**
 * Created by arShown on 2016/6/8.
 */

var EventsListenLibrary = {
  eventKey: null,
  register(key) {
    this.eventKey = key;
  },

  addListener(eventName, callbacks) {
    window.addEventListener(eventName, function (e) {
      if (e.detail == this.eventKey) {
        callbacks();
      }
    }.bind(this));
  },

  removeListener() {

  },

  dispatchEvent(eventName) {
    var event = new CustomEvent(eventName, {'detail': this.eventKey});
    window.dispatchEvent(event);
  }
};
export default EventsListenLibrary;
