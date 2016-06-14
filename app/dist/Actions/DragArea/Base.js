/**
 * Created by arShown on 2016/6/8.
 */
"use strict";
import Model from '../../Models/Model';
import Contants from '../../Contants/Contants';
import EventsListenLibrary from '../../Libraries/EventsListenLibrary';
import UnitLibrary from '../../Libraries/UnitLibrary';
import PointsLibrary from '../../Libraries/PointsLibrary';

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
    this.stageWidth = this.masterStage.width - (2 * this.masterStage.stagePadding);
    this.stageHeight = this.masterStage.height - (2 * this.masterStage.stagePadding);
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

  /**
   * 取得對稱點，過濾重複使用的參數
   * @param unSlope 斜率
   * @param pointX 滑鼠座標
   * @param pointY 滑鼠座標
   * @param x
   * @param y
   * @returns {mirrorX: number, mirrorY: number}
   */
  getMirrorPosition(unSlope, pointX, pointY, x, y) {
    var LineFuc = PointsLibrary.theVerticalLineFuc(this.originPointX, pointX, this.originPointY, pointY);
    return PointsLibrary.getMirrorPosition(x, y, unSlope, LineFuc);
  }

  /**
   * 兩線相交的點，過濾重複使用的參數
   * @param unSlope 斜率
   * @param pointX 滑鼠座標
   * @param pointY 滑鼠座標
   * @param a
   * @param b
   * @param c
   * @returns {point[x,y]}
   */
  getIntersectPosition(unSlope, pointX, pointY, a, b, c) {
    var middlePoint = PointsLibrary.middleBetweenPoints(this.originPointX, pointX, this.originPointY, pointY);
    return PointsLibrary.getIntersectPosition(unSlope, -1, unSlope * middlePoint.x - middlePoint.y, a, b, c);
  }
}
