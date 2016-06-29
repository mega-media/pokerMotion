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
    this.stage = {};
    this.model = new Model(this.masterStage.pokerPrimaryKey);
    this._initPosition();
  }

  _initPosition() {
    this.positions = {};
    this.positions[Contants.TOP_LEFT] = [];
    this.positions[Contants.BOTTOM_LEFT] = [];
    this.positions[Contants.BOTTOM_RIGHT] = [];
    this.positions[Contants.ANOTHER_POS] = [];
    this.positions[Contants.TOP_RIGHT] = [];
  }

  _setListener() {
    EventsListenLibrary.addListener(this.masterStage.pokerPrimaryKey, Contants.CARD_CREATE, this.create.bind(this));
    EventsListenLibrary.addListener(this.masterStage.pokerPrimaryKey, Contants.CARD_UPDATE, this.update.bind(this));
  }

  create() {
    const defaultPositions = {};
    defaultPositions[Contants.TOP_LEFT] = [this.padding, this.padding];
    defaultPositions[Contants.TOP_RIGHT] = [this.masterStage.width - this.padding, this.padding];
    defaultPositions[Contants.BOTTOM_RIGHT] = [this.masterStage.width - this.padding, this.masterStage.height - this.padding];
    defaultPositions[Contants.BOTTOM_LEFT] = [this.padding, this.masterStage.height - this.padding];

    this._initPosition();
    this.positions = Object.assign(this.positions, defaultPositions);
    this.model.set(Contants.CARD_DB_KEY, defaultPositions);
    return this.render();
  }

  update() {
    this._initPosition();
    this.positions = Object.assign(this.positions, this.model.get(Contants.CARD_DB_KEY));
    return this.render();
  }

  _getKeySort() {
    let keySort = [];
    var origin_direction = this.model.get(Contants.MOVE_ORIGIN);
    switch (origin_direction) {
      case Contants.ORIGIN_BOTTOM_LEFT:
        keySort = [
          Contants.TOP_LEFT,
          Contants.BOTTOM_LEFT,
          Contants.BOTTOM_RIGHT,
          Contants.ANOTHER_POS,
          Contants.TOP_RIGHT
        ];
        break;
      default:
        keySort = [
          Contants.TOP_LEFT,
          Contants.BOTTOM_LEFT,
          Contants.BOTTOM_RIGHT,
          Contants.TOP_RIGHT
        ];
        break;
    }
    return keySort;
  }

  render() {
    var pokerMask = new Phaser.Graphics(this.masterStage);
    if (Object.keys(this.positions).length > 0) {
      let keySort = this._getKeySort();
      let firstPos = [];
      keySort.map(key => {
        let pos = this.positions[key];
        if (pos.length == 0) {
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
