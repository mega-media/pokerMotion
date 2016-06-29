/**
 * Created by arShown on 2016/6/7.
 */
"use strict";
import BaseComponent from './BaseComponent';
import Model from '../Models/Model';
import Contants from '../Contants/Contants';
import EventsListenLibrary from '../Libraries/EventsListenLibrary';
import UnitLibrary from '../Libraries/UnitLibrary';
import PointsLibrary from '../Libraries/PointsLibrary';

export default class Motion extends BaseComponent {
  constructor(masterStage) {
    super();
    this.masterStage = masterStage;
    this._registerComponents();
    this._setListener();
  }

  _registerComponents() {
    this.positions = {};
    this.stage = {};
    this.model = new Model(this.masterStage.pokerPrimaryKey);
  }

  _setListener() {
    EventsListenLibrary.addListener(this.masterStage.pokerPrimaryKey, Contants.MOTION_UPDATE, this.update.bind(this));
    EventsListenLibrary.addListener(this.masterStage.pokerPrimaryKey, Contants.MOTION_REMOVE, this.remove.bind(this));
  }

  create() {
    return this;
  }

  update() {
    this.positions = this.model.get(Contants.MOTION_DB_KEY);
    return this.render();
  }

  render() {
    if (Object.keys(this.stage).length == 0) {
      this.stage = this.masterStage.add.sprite(0, 0, Contants.MOTION_IMAGE);
      this.stage.width = this.masterStage.width - (2 * this.masterStage.stagePadding);
      this.stage.height = this.masterStage.height - (2 * this.masterStage.stagePadding);
    }
    Object.assign(this.stage, this.compute());
    this.stage.anchor.setTo(this.stage.anchorX, this.stage.anchorY);

    var pokerMask = new Phaser.Graphics(this.masterStage);
    if (Object.keys(this.positions).length > 0) {
      let firstPos = [];
      this.keySort.map(key => {
        let pos = this.positions[key];
        if (typeof pos === "undefined" || pos.length == 0) {
          return;
        }
        if (firstPos.length == 0) {
          firstPos = pos;
          pokerMask.moveTo(pos[0], pos[1]);
          return;
        }
        pokerMask.lineTo(pos[0], pos[1]);
      });
      pokerMask.lineTo(firstPos[0], firstPos[1]);
    }
    this.stage.mask = pokerMask;
    
    return this;
  }

  compute() {
    var origin_direction = this.model.get(Contants.MOVE_ORIGIN);
    var sprite = {};

    switch (origin_direction) {
      case Contants.ORIGIN_TOP_RIGHT:
        break;
      case Contants.ORIGIN_BOTTOM_LEFT:
        this.keySort = [
          Contants.BOTTOM_LEFT,
          Contants.BOTTOM_RIGHT,
          Contants.TOP_RIGHT,
          Contants.TOP_LEFT
        ];
        sprite.x = this.positions[Contants.BOTTOM_LEFT][0];
        sprite.y = this.positions[Contants.BOTTOM_LEFT][1];
        sprite.anchorX = 0;
        sprite.anchorY = 1;
        sprite.angle = PointsLibrary.angleBetweenPoints(
          this.positions[Contants.BOTTOM_RIGHT][0],
          this.positions[Contants.BOTTOM_LEFT][0],
          this.positions[Contants.BOTTOM_RIGHT][1],
          this.positions[Contants.BOTTOM_LEFT][1]
        );
        break;
    }
    return sprite;
  }

  remove() {
    this.masterStage.world.remove(this.stage);
    this.stage = {};
    return this;
  }
}
