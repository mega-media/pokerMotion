/**
 * Created by arShown on 2016/6/7.
 */
"use strict";
import BaseStage from './BaseStage';
import Card from '../Components/Card';
import Motion from '../Components/Motion';
import DragAction from '../Actions/DragAction';
import Contants from '../Contants/Contants';
import EventsListenLibrary from '../Libraries/EventsListenLibrary';

export default class MainStage extends BaseStage {
  constructor(masterStage, cardImg) {
    super();
    this.masterStage = masterStage;
    this.cardImg = cardImg;
    this._registerComponents();
  }

  _registerComponents() {
    new Card(this.masterStage);
    new Motion(this.masterStage);
  }

  preload() {
    console.log("========== preload all stage ==========");
    this.masterStage.load.image(Contants.CARD_IMAGE, "assets/images/pokerCover.jpg");
    this.masterStage.load.image(Contants.MOTION_IMAGE, "assets/images/" + this.cardImg);
  }

  create() {
    EventsListenLibrary.dispatchEvent(this.masterStage.pokerPrimaryKey, Contants.CARD_CREATE);
    var dragAction = new DragAction(this.masterStage);
    dragAction.startDragMotion();
  }

}
