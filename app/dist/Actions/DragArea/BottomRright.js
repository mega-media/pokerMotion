/**
 * Created by arShown on 2016/6/8.
 */
"use strict";
import Base from './Base';
import Contants from '../../Contants/Contants';
import EventsListenLibrary from '../../Libraries/EventsListenLibrary';
import UnitLibrary from '../../Libraries/UnitLibrary';
import Model from '../../Models/Model';

export default class BottomRight extends Base {
  constructor(masterStage) {
    super();
    this.masterStage = masterStage;
    this._registerComponents();
  }

  _registerComponents() {
    this.model = new Model(this.masterStage.pokerPrimaryKey);
    this.moving = false;

    this.stageWidth = this.masterStage.width - (2 * this.masterStage.stagePadding);
    this.stageHeight = this.masterStage.height - (2 * this.masterStage.stagePadding);
    this.originPointX = this.masterStage.width - this.masterStage.stagePadding;
    this.originPointY = this.masterStage.height - this.masterStage.stagePadding;

    this.originCardPositions = UnitLibrary.objectToArray(this.model.get(Contants.CARD_DB_KEY));
  }

  getToggleArea() {
    var areaSize = 50;
    var bmd = this.masterStage.add.bitmapData(areaSize, areaSize);
    var sprite = this.masterStage.add.sprite(
      this.originPointX - (areaSize / 2),
      this.originPointY - (areaSize / 2),
      bmd);
    sprite.dragMotion = this.dragMotion.bind(this);
    sprite.resetMotion = this.resetMotion.bind(this);
    return sprite;
  }

  dragMotion(pointer) {
    if (this.moving) {
      return false;
    }
    var pointY = pointer.y > this.originPointY ? this.originPointY - 1 : pointer.y;
    var pointX = pointer.x > this.originPointX ? this.originPointX - 1 : pointer.x;

    this.renderComponent(pointX, pointY);
  }

  resetMotion() {
    if (this.moving) {
      return false;
    }
    this.moving = true;
    /*
     * 放開時的座標
     */
    var pointer = UnitLibrary.objectToArray(this.model.get(Contants.MOTION_DB_KEY))[0];
    var x = pointer[0];
    var y = pointer[1];
    var startX = pointer[0];
    var startY = pointer[1];

    var sizeX = this.originPointX - startX;
    var sizeY = this.originPointY - startY;

    var _delay = null;
    var finishInterval = function () {
      clearInterval(_delay);
      EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.MOTION_REMOVE);
      EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.CARD_CREATE);
      this.moving = false;
      return false;
    }.bind(this);

    //重置
    if (sizeX >= sizeY) {
      _delay = setInterval(function () {
        var limit = parseFloat(sizeX / 200);
        if (x >= this.originPointX - limit) {
          return finishInterval();
        }
        x = parseFloat(x + limit);
        this.renderComponent(x, parseFloat(startY + ((x - startX) * (this.originPointY - startY)) / (this.originPointX - startX)));
      }.bind(this), 1);
    } else {
      _delay = setInterval(function () {
        var limit = parseFloat(sizeY / 200);
        if (y >= this.originPointY - limit) {
          return finishInterval();
        }
        y = parseFloat(y + limit);
        this.renderComponent(parseFloat(startX + ((y - startY) * (this.originPointX - startX)) / (this.originPointY - startY)), y);
      }.bind(this), 1);
    }
  }

  renderComponent(pointX, pointY) {
    var padding = this.masterStage.stagePadding;

    var mK = parseFloat(this.originPointX - pointX);
    var mL = parseFloat(this.originPointY - pointY);

    /*
     * 計算短邊長邊
     */
    var temp = parseFloat(Math.pow(mL, 2) + Math.pow(mK, 2));
    var sizeShort = parseFloat(temp / (2 * mK));
    var sizeLong = parseFloat(temp / (2 * mL));
    /*
     * 生成路徑
     */
    if (sizeLong > this.originPointY) {
      /*
       * 生成右四邊形路徑
       */
      var an = parseFloat(sizeLong - this.originPointY);
      var largerTrianShortSize = parseFloat(an / (sizeLong - (this.originPointY - pointY)) * (this.originPointX - pointX));
      var smallTrianShortSize = parseFloat(an / sizeLong * sizeShort);
      var offsetPosY = parseFloat(Math.sqrt(Math.abs(Math.pow((this.originPointX - largerTrianShortSize) - pointX, 2) - Math.pow(this.originPointY, 2))) - pointY);

      /* 移動區元件 */
      this.model.set(Contants.MOTION_DB_KEY,
        [pointX, pointY],
        [this.originPointX - largerTrianShortSize, padding - offsetPosY],
        [this.originPointX - smallTrianShortSize, padding],
        [this.originPointX - sizeShort, this.originPointY]);
      EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.MOTION_UPDATE);

      /* 卡片元件 */
      this.model.set(Contants.CARD_DB_KEY,
        this.originCardPositions[0],
        this.originCardPositions[1],
        [this.originPointX - sizeShort, this.originPointY],
        [this.originPointX - smallTrianShortSize, padding]
      );
      EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.CARD_UPDATE);

      return this;

    } else if (sizeShort > this.originPointX) {
      /*
       * 生成下四邊形路徑
       */
      var an = parseFloat(sizeShort - this.originPointX);
      var largerTrianLongSize = parseFloat(an / (sizeShort - (this.originPointX - pointX)) * (this.originPointY - pointY));
      var smallTrianLongSize = parseFloat(an / sizeShort * sizeLong);
      var offsetPosX = parseFloat(Math.sqrt(Math.abs(Math.pow((this.originPointY - largerTrianLongSize) - pointY, 2) - Math.pow(this.originPointX, 2))) - pointX);

      this.model.set(Contants.MOTION_DB_KEY,
        [pointX, pointY],
        [padding - offsetPosX, this.originPointY - largerTrianLongSize],
        [padding, this.originPointY - smallTrianLongSize],
        [this.originPointX, this.originPointY - sizeLong]);
      EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.MOTION_UPDATE);

      /* 卡片元件 */
      this.model.set(Contants.CARD_DB_KEY,
        this.originCardPositions[0],
        [padding, this.originPointY - smallTrianLongSize],
        [this.originPointX, this.originPointY - sizeLong],
        this.originCardPositions[3]
      );
      EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.CARD_UPDATE);

      return this;

    } else {

      /*
       * 生成三角形路徑
       */
      var offsetPosY = (this.originPointY - sizeLong) < padding ? padding : this.originPointY - sizeLong;
      var offsetPosX = (this.originPointX - sizeShort) < padding ? padding : this.originPointX - sizeShort;
      this.model.set(Contants.MOTION_DB_KEY,
        [pointX, pointY],
        [this.originPointX, offsetPosY],
        [offsetPosX, this.originPointY]);
      EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.MOTION_UPDATE);

      /* 卡片元件 */
      this.model.set(Contants.CARD_DB_KEY,
        this.originCardPositions[0],
        this.originCardPositions[1],
        [offsetPosX, this.originPointY],
        [this.originPointX, offsetPosY],
        this.originCardPositions[3]
      );
      EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.CARD_UPDATE);

      return this;

    }
  }

}