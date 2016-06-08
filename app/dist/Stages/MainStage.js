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
  constructor(masterStage) {
    super();
    this.masterStage = masterStage;
    this._registerComponents();
  }

  _registerComponents() {
    EventsListenLibrary.register(this.masterStage.pokerPrimaryKey);
    new Card(this.masterStage);
    new Motion(this.masterStage);
  }

  preload() {
    console.log("========== preload all stage ==========");
    EventsListenLibrary.dispatchEvent(Contants.CARD_CREATE);
    sessionStorage.clear();
  }

  create() {
    var dragAction = new DragAction(this.masterStage);
    dragAction.startDragMotion();
  }

}
