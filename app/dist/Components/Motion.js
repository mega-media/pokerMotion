/**
 * Created by arShown on 2016/6/7.
 */
"use strict";
import BaseComponent from './BaseComponent';
import Model from '../Models/Model';
import Contants from '../Contants/Contants';
import EventsListenLibrary from '../Libraries/EventsListenLibrary';
import UnitLibrary from '../Libraries/UnitLibrary';

export default class Motion extends BaseComponent {
  constructor(masterStage) {
    super();
    this.masterStage = masterStage;
    this._registerComponents();
    this._setListener();
  }

  _registerComponents() {
    this.positions = [];
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
    this.positions = UnitLibrary.objectToArray(this.model.get(Contants.MOTION_DB_KEY));
    return this.render();
  }

  render() {
    var pokerMask = new Phaser.Graphics(this.masterStage);
    if (this.positions.length > 0) {
      this.positions.map((pos, index) => index == 0 ? pokerMask.moveTo(pos[0], pos[1]) : pokerMask.lineTo(pos[0], pos[1]));
      pokerMask.lineTo(this.positions[0][0], this.positions[0][1]);
    }
    if (Object.keys(this.stage).length == 0) {
      this.stage = this.masterStage.add.sprite(0, 0, Contants.MOTION_IMAGE);
      this.stage.height = this.masterStage.height - (2 * this.masterStage.stagePadding);
      this.stage.width = this.masterStage.width - (2 * this.masterStage.stagePadding);
    }
    Object.assign(this.stage, this.compute());
    this.stage.anchor.setTo(this.stage.anchorX, this.stage.anchorY);
    this.stage.mask = pokerMask;
    return this;
  }

  compute() {
    var origin_direction = this.model.get(Contants.MOVE_ORIGIN);
    var sprite = {};
    switch (origin_direction) {
      case Contants.ORIGIN_TOP_RIGHT:
        if (this.positions.length <= 3) {
          var [direction_top_right, direction_top_left, direction_bottom_right] = this.positions;
        } else {
          var [direction_top_right, direction_top_left, direction_bottom_left, direction_bottom_right] = this.positions;
        }
        sprite.x = direction_top_right[0];
        sprite.y = direction_top_right[1];
        sprite.anchorX = 1;
        sprite.anchorY = 0;
        sprite.angle = UnitLibrary.angleBetweenPoints(direction_top_right[0], direction_top_left[0], direction_top_right[1], direction_top_left[1]);

        break;
      case Contants.ORIGIN_BOTTOM_LEFT:
        if (this.positions.length <= 3) {
          var [direction_bottom_left, direction_bottom_right, direction_top_left] = this.positions;
        } else {
          var [ direction_bottom_left, direction_bottom_right, direction_top_right, direction_top_left] = this.positions;
        }
        sprite.x = direction_bottom_left[0];
        sprite.y = direction_bottom_left[1];
        sprite.anchorX = 0;
        sprite.anchorY = 1;
        sprite.angle = UnitLibrary.angleBetweenPoints(direction_bottom_right[0], direction_bottom_left[0], direction_bottom_right[1], direction_bottom_left[1]);

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
