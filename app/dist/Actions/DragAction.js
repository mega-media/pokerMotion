/**
 * Created by arShown on 2016/6/7.
 */
"use strict";

import DragAreaBR from './DragArea/BottomRright';

export default class DragAction {
  constructor(masterStage) {
    this.masterStage = masterStage;
    this._registerComponents();
  }

  _registerComponents() {
    this.masterStage.physics.startSystem(Phaser.Physics.P2JS);
    this.motionAction = {};
    this.resetAction = {};

    this.dragArea = [];
    this.dragArea.push(new DragAreaBR(this.masterStage).getToggleArea());
    //Enable the physics bodies on all the sprites and turn on the visual debugger
    this.masterStage.physics.p2.enable(this.dragArea, true);
  }

  startDragMotion() {
    this.masterStage.input.onDown.add(this.bindDragAreaMotion, this);
    this.masterStage.input.onUp.add(this.unbindDragAreaMotion, this);
    this.masterStage.input.addMoveCallback(this.hoverDragAreaMotion, this);
  }

  hoverDragAreaMotion(pointer) {
    var bodies = this.masterStage.physics.p2.hitTest(pointer.position, this.dragArea);
    if (bodies.length < 1) {
      //console.log("out");
      return false;
    }
    //console.log("over");
  }

  bindDragAreaMotion(pointer) {
    var bodies = this.masterStage.physics.p2.hitTest(pointer.position, this.dragArea);
    if (bodies.length < 1) {
      return false;
    }
    
    this.motionAction = bodies[0].parent.sprite.dragMotion;
    this.resetAction = bodies[0].parent.sprite.resetMotion;
    this.masterStage.input.addMoveCallback(this.motionAction);
  }

  unbindDragAreaMotion(pointer) {
    if (typeof this.resetAction !== "function") {
      return false;
    }
    if (typeof this.motionAction == "function") {
      this.masterStage.input.deleteMoveCallback(this.motionAction);
    }
    this.resetAction.call(this, pointer);
    this.resetAction = {};
  }

}
