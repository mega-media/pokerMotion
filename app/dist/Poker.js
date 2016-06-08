/**
 * Created by arShown on 2016/6/7.
 */
"use strict";
import MainStage from './Stages/MainStage';
import UnitLibrary from './Libraries/UnitLibrary';

export default class Poker {
  constructor() {
    this.parent = "";
    this.width = 800;
    this.height = 1000;
    this.renderer = Phaser.CANVAS;
    this.phaserGame = {};
    this.pokerKey = UnitLibrary.makePrimaryKey();
  }

  start() {
    console.log("================ Poker start! ================ ");
    /* 建構主stage */
    this.phaserGame = new Phaser.Game(this.width, this.height, this.renderer, this.parent);
    this.phaserGame.pokerPrimaryKey = this.pokerKey;
    this.phaserGame.stagePadding = 100;
    /* 場景 */
    this.phaserGame.state.add("loadStage", new MainStage(this.phaserGame));
    this.phaserGame.state.start("loadStage");

  }

  destroy() {
    this.phaserGame.destroy();
    console.log("================ Poker destory! ================ ");
  }
}
