/**
 * Created by arShown on 2016/6/8.
 */
"use strict";
import Base from './Base';
import Contants from '../../Contants/Contants';
import EventsListenLibrary from '../../Libraries/EventsListenLibrary';
import Model from '../../Models/Model';

export default class BR extends Base {
  constructor(masterStage) {
    super();
    this.masterStage = masterStage;
    this._registerComponents();

  }

  _registerComponents() {
    EventsListenLibrary.register(this.masterStage.pokerPrimaryKey);
    this.model = new Model(this.masterStage.pokerPrimaryKey);
  }

  getToggleArea() {
    var bmd = this.masterStage.add.bitmapData(100, 100);
    var sprite = this.masterStage.add.sprite(
      this.masterStage.width - this.masterStage.stagePadding - (this.masterStage.stagePadding / 2),
      this.masterStage.height - this.masterStage.stagePadding - (this.masterStage.stagePadding / 2),
      bmd);
    sprite.dragMotion = function () {
      this.dragMotion.apply(this, arguments)
    }.bind(this);
    return sprite;
  }

  dragMotion(pointer) {
    var pointY = pointer.y;
    var pointX = pointer.x;
    var padding = this.masterStage.stagePadding;
    this.stageWidth = this.masterStage.width - (padding * 2);
    this.stageHeight = this.masterStage.height - (padding * 2);
    this.stagePositionY = padding;
    this.stagePositionX = padding;

    var stageWidth = this.stageWidth + this.stagePositionX;
    var stageHeight = this.stageHeight + this.stagePositionY;

    var mK = parseFloat(stageWidth - pointX);
    var mL = parseFloat(stageHeight - pointY);

    /*
     * 計算短邊長邊
     */
    var temp = parseFloat(Math.pow(mL, 2) + Math.pow(mK, 2));
    var sizeShort = parseFloat(temp / (2 * mK));
    var sizeLong = parseFloat(temp / (2 * mL));

    /*
     * 生成路徑
     */

    console.log(sizeLong, sizeShort, stageWidth);
    if (sizeLong > stageHeight) {
      /*
       * 生成右四邊形路徑
       */
      var an = parseFloat(sizeLong - stageHeight);
      var largerTrianShortSize = parseFloat(an / (sizeLong - (stageHeight - pointY)) * (stageWidth - pointX));
      var smallTrianShortSize = parseFloat(an / sizeLong * sizeShort);

      var offsetPosY = parseFloat(Math.sqrt(Math.abs(Math.pow((stageWidth - largerTrianShortSize) - pointX, 2) - Math.pow(stageHeight, 2))) - pointY);
      this.model.set(Contants.MOTION_DB_KEY,
        [pointX, pointY],
        [stageWidth - largerTrianShortSize, this.stagePositionY - offsetPosY],
        [stageWidth - smallTrianShortSize, this.stagePositionY],
        [stageWidth - sizeShort, stageHeight]);
      EventsListenLibrary.dispatchEvent(Contants.MOTION_UPDATE);
      return this;
    } else if (sizeShort > stageWidth) {
      /*
       * 生成下四邊形路徑
       */
      var an = parseFloat(sizeShort - stageWidth);
      var largerTrianLongSize = parseFloat(an / (sizeShort - (stageWidth - pointX)) * (stageHeight - pointY));
      var smallTrianLongSize = parseFloat(an / sizeShort * sizeLong);

      var offsetPosX = parseFloat(Math.sqrt(Math.abs(Math.pow((stageHeight - largerTrianLongSize) - pointY, 2) - Math.pow(stageWidth, 2))) - pointX);
      this.model.set(Contants.MOTION_DB_KEY,
        [pointX, pointY],
        [this.stagePositionX - offsetPosX, stageHeight - largerTrianLongSize],
        [this.stagePositionX, stageHeight - smallTrianLongSize],
        [stageWidth, stageHeight - sizeLong]);
      EventsListenLibrary.dispatchEvent(Contants.MOTION_UPDATE);
      return this;
    } else {
      /*
       * 生成三角形路徑
       */
      var offsetPosY = (stageHeight - sizeLong) < this.stagePositionY ? this.stagePositionY : stageHeight - sizeLong;
      var offsetPosX = (stageWidth - sizeShort) < this.stagePositionX ? this.stagePositionX : stageWidth - sizeShort;
      this.model.set(Contants.MOTION_DB_KEY, [pointX, pointY], [stageWidth, offsetPosY], [offsetPosX, stageHeight]);
      EventsListenLibrary.dispatchEvent(Contants.MOTION_UPDATE);
      return this;
    }
  }

}