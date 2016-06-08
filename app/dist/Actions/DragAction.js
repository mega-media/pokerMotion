/**
 * Created by arShown on 2016/6/7.
 */
"use strict";

import DragAreaBR from './DragArea/BR';
import Contants from '../Contants/Contants';
import EventsListenLibrary from '../Libraries/EventsListenLibrary';

export default class DragAction {
  constructor(masterStage) {
    this.masterStage = masterStage;
    this._registerComponents();
  }

  _registerComponents() {
    EventsListenLibrary.register(this.masterStage.pokerPrimaryKey);
    this.masterStage.physics.startSystem(Phaser.Physics.P2JS);
    this.dragArea = [];
    this.dragArea.push(new DragAreaBR(this.masterStage).getToggleArea());

    //Enable the physics bodies on all the sprites and turn on the visual debugger
    this.masterStage.physics.p2.enable(this.dragArea, true);
  }

  startDragMotion() {
    this.masterStage.input.onDown.add(this.bindDragAreaMotion, this);
    //this.masterStage.input.onUp.add(this.bindDragAreaMotion, this);
  }

  bindDragAreaMotion(pointer) {
    var bodies = this.masterStage.physics.p2.hitTest(pointer.position, this.dragArea);
    if (bodies.length < 1)
    {
      EventsListenLibrary.dispatchEvent(Contants.MOTION_REMOVE);
      return false;
    }
    bodies[0].parent.sprite.dragMotion(pointer);
  }

  finishDragMotion() {
  }
}
