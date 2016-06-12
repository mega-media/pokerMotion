/**
 * Created by arShown on 2016/6/8.
 */
"use strict";
import Base from './Base';
import Contants from '../../Contants/Contants';
import UnitLibrary from '../../Libraries/UnitLibrary';

export default class BottomRight extends Base {
  constructor(masterStage) {
    super(masterStage);
    this._registerComponents();
  }

  _registerComponents() {
    super._registerComponents();
    this.areaName = Contants.AREA_BOTTOM_RIGHT;
    this.originPointX = this.masterStage.width - this.masterStage.stagePadding;
    this.originPointY = this.masterStage.height - this.masterStage.stagePadding;
  }

  getToggleArea() {
    //var areaSize = 50;
    var bmd = this.masterStage.add.bitmapData(this.areaSize, this.areaSize);
    var sprite = this.masterStage.add.sprite(
      this.originPointX - (this.areaSize / 2),
      this.originPointY - (this.areaSize / 2),
      bmd);
    sprite.dragMotion = this.dragMotion.bind(this);
    sprite.resetMotion = this.resetMotion.bind(this);
    return sprite;
  }

  dragMotion(pointer) {
    if (!this.getMovePermission()) {
      return false;
    }
    this.setMovePermission(true);

    var pointY = Math.min(pointer.y, this.originPointY - 1);
    var pointX = Math.min(pointer.x, this.originPointX - 1);
    this.renderComponent(pointX, pointY);
  }

  resetMotion() {
    if (!this.getMovePermission()) {
      return false;
    }
    this.setMovePermission(false);
    /*
     * 放開時的座標
     */
    var pointer = UnitLibrary.objectToArray(this.model.get(Contants.MOTION_DB_KEY))[0];
    var [x,y] = pointer;
    var [startX,startY] = pointer;

    var sizeX = this.originPointX - startX;
    var sizeY = this.originPointY - startY;

    //重置
    if (sizeX >= sizeY) {
      this.bindInterval(function () {
        var limit = parseFloat(sizeX / this.intervalLimit);
        if (x >= this.originPointX - limit) {
          return this.finishInterval();
        }
        x = parseFloat(x + limit);
        this.renderComponent(x, parseFloat(startY + ((x - startX) * (this.originPointY - startY)) / (this.originPointX - startX)));
      }.bind(this));
    } else {
      this.bindInterval(function () {
        var limit = parseFloat(sizeY / this.intervalLimit);
        if (y >= this.originPointY - limit) {
          return this.finishInterval();
        }
        y = parseFloat(y + limit);
        this.renderComponent(parseFloat(startX + ((y - startY) * (this.originPointX - startX)) / (this.originPointY - startY)), y);
      }.bind(this));
    }
  }

  renderComponent(pointX, pointY) {
    var padding = this.masterStage.stagePadding;
    var {sizeLeft, sizeRight} = UnitLibrary.sizeBetweenPoints(pointX, this.originPointX, pointY, this.originPointY);

    /*
     * 生成路徑
     */
    if (sizeRight > this.originPointY) {
      /*
       * 生成右四邊形路徑
       */
      var an = parseFloat(sizeRight - this.originPointY);
      var largerTrianSizeLeft = parseFloat(an / (sizeRight - (this.originPointY - pointY)) * (this.originPointX - pointX));
      var smallTrianSizeLeft = parseFloat(an / sizeRight * sizeLeft);
      var offsetPosY = parseFloat(Math.sqrt(Math.abs(Math.pow((this.originPointX - largerTrianSizeLeft) - pointX, 2) - Math.pow(this.originPointY, 2))) - pointY);

      /* 移動區元件 */
      /* 座標紀錄順序為逆時針 */
      this.model.set(Contants.MOTION_DB_KEY,
        [pointX, pointY],
        [this.originPointX - sizeLeft, this.originPointY],
        [this.originPointX - smallTrianSizeLeft, padding],
        [this.originPointX - largerTrianSizeLeft, padding - offsetPosY]
      );

      /* 卡片元件 */
      this.model.set(Contants.CARD_DB_KEY,
        this.originCardPositions[0],
        this.originCardPositions[1],
        [this.originPointX - sizeLeft, this.originPointY],
        [this.originPointX - smallTrianSizeLeft, padding]
      );

      /* 呼叫繪製 */
      this.dispatchComponent();
      return this;

    } else if (sizeLeft > this.originPointX) {
      /*
       * 生成下四邊形路徑
       */
      var an = parseFloat(sizeLeft - this.originPointX);
      var largerTrianSizeRight = parseFloat(an / (sizeLeft - (this.originPointX - pointX)) * (this.originPointY - pointY));
      var smallTrianSizeRight = parseFloat(an / sizeLeft * sizeRight);
      var offsetPosX = parseFloat(Math.sqrt(Math.abs(Math.pow((this.originPointY - largerTrianSizeRight) - pointY, 2) - Math.pow(this.originPointX, 2))) - pointX);

      /* 移動區元件 */
      /* 座標紀錄順序為逆時針 */
      this.model.set(Contants.MOTION_DB_KEY,
        [pointX, pointY],
        [padding - offsetPosX, this.originPointY - largerTrianSizeRight],
        [padding, this.originPointY - smallTrianSizeRight],
        [this.originPointX, this.originPointY - sizeRight]);

      /* 卡片元件 */
      this.model.set(Contants.CARD_DB_KEY,
        this.originCardPositions[0],
        [padding, this.originPointY - smallTrianSizeRight],
        [this.originPointX, this.originPointY - sizeRight],
        this.originCardPositions[3]
      );

      /* 呼叫繪製 */
      this.dispatchComponent();
      return this;

    } else {

      /*
       * 生成三角形路徑
       */
      var offsetPosY = (this.originPointY - sizeRight) < padding ? padding : this.originPointY - sizeRight;
      var offsetPosX = (this.originPointX - sizeLeft) < padding ? padding : this.originPointX - sizeLeft;

      /* 移動區元件 */
      /* 座標紀錄順序為逆時針 */
      this.model.set(Contants.MOTION_DB_KEY,
        [pointX, pointY],
        [offsetPosX, this.originPointY],
        [this.originPointX, offsetPosY]
      );

      /* 卡片元件 */
      this.model.set(Contants.CARD_DB_KEY,
        this.originCardPositions[0],
        this.originCardPositions[1],
        [offsetPosX, this.originPointY],
        [this.originPointX, offsetPosY],
        this.originCardPositions[3]
      );

      /* 呼叫繪製 */
      this.dispatchComponent();
      return this;
    }
  }

  dispatchComponent() {
    this.model.set(Contants.MOVE_ORIGIN, Contants.ORIGIN_BOTTOM_LEFT);
    super.dispatchComponent();
  }

}