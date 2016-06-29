/**
 * Created by arShown on 2016/6/8.
 */
"use strict";
import Base from './Base';
import Contants from '../../Contants/Contants';
import UnitLibrary from '../../Libraries/UnitLibrary';
import PointsLibrary from '../../Libraries/PointsLibrary';

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
    var pointer = this.model.get(Contants.MOTION_DB_KEY)[Contants.BOTTOM_LEFT];
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
    var {sizeLeft, sizeRight} = PointsLibrary.sizeBetweenPoints(pointX, this.originPointX, pointY, this.originPointY);
    var unSlope = PointsLibrary.unSlopeBetweenPoints(this.originPointX, pointX, this.originPointY, pointY);

    /**
     * 取對稱點，再次過濾重複參數
     * @method this.getMirrorPosition
     */
    var getMirrorPosition = function (x, y) {
      return this.getMirrorPosition(unSlope, pointX, pointY, x, y)
    }.bind(this);

    /**
     * 取兩線相交的點，再次過濾重複參數
     * @method this.getIntersectPosition
     */
    var getIntersectPosition = function (a, b, c) {
      return this.getIntersectPosition(unSlope, pointX, pointY, a, b, c);
    }.bind(this);

    /*
     * 生成路徑
     */
    const cardPositionData = {};
    const positionData = {};
    if (sizeRight > this.stageHeight) {
      var {mirrorX, mirrorY} = getMirrorPosition(this.originPointX, padding);
      /*
       * 生成右四邊形路徑
       */

      /* 移動區元件 */
      positionData[Contants.TOP_LEFT] = [mirrorX, mirrorY];
      positionData[Contants.TOP_RIGHT] = getIntersectPosition(0, 1, padding);
      positionData[Contants.BOTTOM_RIGHT] = getIntersectPosition(0, 1, this.originPointY);
      positionData[Contants.BOTTOM_LEFT] = [pointX, pointY];

      /* 卡片元件 */
      cardPositionData[Contants.TOP_LEFT] = this.originCardPositions[Contants.TOP_LEFT];
      cardPositionData[Contants.TOP_RIGHT] = getIntersectPosition(0, 1, padding);
      cardPositionData[Contants.BOTTOM_RIGHT] = getIntersectPosition(0, 1, this.originPointY);
      cardPositionData[Contants.BOTTOM_LEFT] = this.originCardPositions[Contants.BOTTOM_LEFT];
    }
    else if (sizeLeft > this.stageWidth) {
      var {mirrorX, mirrorY} = getMirrorPosition(padding, this.originPointY);
      /*
       * 生成下四邊形路徑
       */

      /* 移動區元件 */
      positionData[Contants.TOP_LEFT] = getIntersectPosition(1, 0, this.originPointX);
      positionData[Contants.TOP_RIGHT] = getIntersectPosition(1, 0, padding);
      positionData[Contants.BOTTOM_RIGHT] = [mirrorX, mirrorY];
      positionData[Contants.BOTTOM_LEFT] = [pointX, pointY];

      /* 卡片元件 */
      cardPositionData[Contants.TOP_LEFT] = this.originCardPositions[Contants.TOP_LEFT];
      cardPositionData[Contants.TOP_RIGHT] = this.originCardPositions[Contants.TOP_RIGHT];
      cardPositionData[Contants.BOTTOM_RIGHT] = getIntersectPosition(1, 0, this.originPointY);
      cardPositionData[Contants.BOTTOM_LEFT] = getIntersectPosition(1, 0, padding);

    } else {
      /*
       * 生成三角形路徑
       */
      //direction_bottom_left, direction_bottom_right, direction_top_right, direction_top_left
      /* 移動區元件 */
      positionData[Contants.TOP_LEFT] = getIntersectPosition(1, 0, this.originPointX);
      positionData[Contants.BOTTOM_RIGHT] = getIntersectPosition(0, 1, this.originPointY);
      positionData[Contants.BOTTOM_LEFT] = [pointX, pointY];

      /* 卡片元件 */
      cardPositionData[Contants.TOP_LEFT] = this.originCardPositions[Contants.TOP_LEFT];
      cardPositionData[Contants.TOP_RIGHT] = this.originCardPositions[Contants.TOP_RIGHT];
      cardPositionData[Contants.BOTTOM_RIGHT] = getIntersectPosition(0, 1, this.originPointY);
      cardPositionData[Contants.BOTTOM_LEFT] = this.originCardPositions[Contants.BOTTOM_LEFT];
      cardPositionData[Contants.ANOTHER_POS] = getIntersectPosition(1, 0, this.originPointX);
    }
    /* 移動區元件 */
    this.model.set(Contants.MOTION_DB_KEY,positionData);
    /* 卡片元件 */
    this.model.set(Contants.CARD_DB_KEY,cardPositionData);
    /* 呼叫繪製 */
    this.dispatchComponent();
    return this;
  }

  dispatchComponent() {
    this.model.set(Contants.MOVE_ORIGIN, Contants.ORIGIN_BOTTOM_LEFT);
    super.dispatchComponent();
  }

}
