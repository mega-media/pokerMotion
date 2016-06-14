/**
 * Created by arShown on 2016/6/7.
 */
"use strict";
import BaseComponent from './BaseComponent';
import Model from '../Models/Model';
import Contants from '../Contants/Contants';
import EventsListenLibrary from '../Libraries/EventsListenLibrary';
import UnitLibrary from '../Libraries/UnitLibrary';

export default class Card extends BaseComponent {
  constructor(masterStage) {
    super();
    this.masterStage = masterStage;
    this._registerComponents();
    this._setListener();
  }

  _registerComponents() {
    this.padding = this.masterStage.stagePadding;
    this.positions = [];
    this.stage = {};
    this.model = new Model(this.masterStage.pokerPrimaryKey);
  }

  _setListener() {
    EventsListenLibrary.addListener(this.masterStage.pokerPrimaryKey, Contants.CARD_CREATE, this.create.bind(this));
    EventsListenLibrary.addListener(this.masterStage.pokerPrimaryKey, Contants.CARD_UPDATE, this.update.bind(this));
  }

  create() {
    this.positions = [
      [this.padding, this.padding],
      [this.padding, this.masterStage.height - this.padding],
      [this.masterStage.width - this.padding, this.masterStage.height - this.padding],
      [this.masterStage.width - this.padding, this.padding]];

    this.model.set(Contants.CARD_DB_KEY,
      [this.padding, this.padding],
      [this.padding, this.masterStage.height - this.padding],
      [this.masterStage.width - this.padding, this.masterStage.height - this.padding],
      [this.masterStage.width - this.padding, this.padding]);

    return this.render();
  }

  update() {
    this.positions = UnitLibrary.objectToArray(this.model.get(Contants.CARD_DB_KEY));
    return this.render();
  }

  render() {
    var pokerMask = new Phaser.Graphics(this.masterStage);
    if (this.positions.length > 0) {
      this.positions.map((pos, index) => index == 0 ? pokerMask.moveTo(pos[0], pos[1]) : pokerMask.lineTo(pos[0], pos[1]));
      pokerMask.lineTo(this.positions[0][0], this.positions[0][1]);
    }
    if (Object.keys(this.stage).length == 0) {
      this.stage = this.masterStage.add.sprite(this.padding, this.padding, Contants.CARD_IMAGE);
      this.stage.width = this.masterStage.width - (2 * this.padding);
      this.stage.height = this.masterStage.height - (2 * this.padding);
    }
    this.stage.mask = pokerMask;
    return this;
  }

  remove() {
    this.masterStage.world.remove(this.stage);
    this.stage = {};
    return this;
  }
}
