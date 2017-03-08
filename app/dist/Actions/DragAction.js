/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/8.
 */
import Card                                                          from '../Components/Card';
import Motion                                                        from '../Components/Motion';
import DragAreaBR                                                    from './DragArea/BottomRight';

export default class DragAction {
    masterStage:Object;
    card:Card;
    motion:Motion;
    motionAction:?() => any;
    resetAction:?() => any;
    dragArea:Array<any>;

    constructor(masterStage:Object, card:Card, motion:Motion) {
        this.masterStage = masterStage;
        this.card = card;
        this.motion = motion;
        this.motionAction = null;
        this.resetAction = null;
        this.dragArea = [];
        this._registerComponents();
    }

    _registerComponents() {
        this.dragArea.push(new DragAreaBR(this.masterStage, this.card, this.motion).getTriggerArea());
        this.masterStage.physics.startSystem(Phaser.Physics.P2JS);
        //Enable the physics bodies on all the sprites and turn on the visual debugger
        this.masterStage.physics.p2.enable(this.dragArea, true);
    }

    startDragMotion() {
        this.masterStage.input.onDown.add(this.bindDragAreaMotion, this);
        this.masterStage.input.onUp.add(this.unbindDragAreaMotion, this);
        this.masterStage.input.addMoveCallback(this.hoverDragAreaMotion, this);
    }

    hoverDragAreaMotion(pointer:Object):void {
        var bodies = this.masterStage.physics.p2.hitTest(pointer.position, this.dragArea);
        /*
        if (bodies.length < 1)
            console.log("out");
        else
            console.log("over");*/
    }

    bindDragAreaMotion(pointer:Object):void {
        var bodies = this.masterStage.physics.p2.hitTest(pointer.position, this.dragArea);
        if (bodies.length) {
            this.motionAction = bodies[0].parent.sprite.dragMotion;
            this.resetAction = bodies[0].parent.sprite.resetMotion;
            this.masterStage.input.addMoveCallback(this.motionAction);
        }
    }

    unbindDragAreaMotion(pointer:Object):void {
        if (typeof this.resetAction === "function") {
            if (typeof this.motionAction == "function") {
                this.masterStage.input.deleteMoveCallback(this.motionAction);
                this.motionAction = null;
            }
            this.resetAction.call(this, pointer);
            this.resetAction = null;
        }
    }
}
