/**
 * Created by arShown on 2016/6/8.
 */
"use strict";
import Model from '../../Models/Model';
import Contants from '../../Contants/Contants';
import EventsListenLibrary from '../../Libraries/EventsListenLibrary';
import UnitLibrary from '../../Libraries/UnitLibrary';

export default class Base {
  constructor(masterStage) {
    this.masterStage = masterStage;
  }

  _registerComponents() {
    this.areaSize = 100;
    this.intervalLimit = 200;
    this.areaName = "";
    this.model = new Model(this.masterStage.pokerPrimaryKey);
    this.originCardPositions = UnitLibrary.objectToArray(this.model.get(Contants.CARD_DB_KEY));
  }

  getMovePermission() {
    var area = typeof this.model.get(Contants.MOVE_AREA) == "undefined" ? this.areaName : this.model.get(Contants.MOVE_AREA);
    return area === this.areaName;
  }

  setMovePermission(pms) {
    this.model.set(Contants.MOVE_AREA, (pms) ? this.areaName : false);
  }

  bindInterval(handler) {
    this.interval = setInterval(handler, 1);
    return this;
  }

  finishInterval() {
    if (typeof this.interval !== "undefined") {
      clearInterval(this.interval);
      EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.MOTION_REMOVE);
      EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.CARD_CREATE);
      this.setMovePermission(true);
    }
    return false;
  }

  dispatchComponent() {
    EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.CARD_UPDATE);
    EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.MOTION_UPDATE);
  }
}
