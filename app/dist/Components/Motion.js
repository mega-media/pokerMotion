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
    this._setListener();
    this._registerComponents();
  }

  _registerComponents() {
    this.positions = [];
    this.stage = {};
    this.model = new Model(this.masterStage.pokerPrimaryKey);
  }

  _setListener() {
    EventsListenLibrary.register(this.masterStage.pokerPrimaryKey);
    EventsListenLibrary.addListener(Contants.MOTION_UPDATE, this.update.bind(this));
    EventsListenLibrary.addListener(Contants.MOTION_REMOVE, this.remove.bind(this));
  }

  create() {
    return this;
  }

  update() {
    this.positions = UnitLibrary.objectToArray(this.model.get(Contants.MOTION_DB_KEY));
    return this.remove().render();
  }

  render() {
    this.stage = this.masterStage.add.graphics(0, 0);
    var graphics = new Phaser.Graphics(this.masterStage);
    graphics.lineStyle(2, 0xFFFFFF, 1);
    if (this.positions.length > 0) {
      this.positions.map((pos, index) => index == 0 ? graphics.moveTo(pos[0], pos[1]) : graphics.lineTo(pos[0], pos[1]));
      graphics.lineTo(this.positions[0][0], this.positions[0][1]);
    }
    this.stage.addChild(graphics);
    return this;
  }

  remove() {
    this.masterStage.world.remove(this.stage);
    return this;
  }
}
