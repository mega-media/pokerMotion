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
    resetMotion:?() => any;
    dragArea:Array<any>;

    constructor(masterStage:Object, card:Card, motion:Motion) {
        this.masterStage = masterStage;
        this.card = card;
        this.motion = motion;
        this.motionAction = null;
        this.resetMotion = null;
        this.dragArea = [];
        this._registerComponents();
    }

    _registerComponents():void {
        this.dragArea.push(new DragAreaBR(this.masterStage, this.card, this.motion).getTriggerArea());
        this.masterStage.physics.startSystem(Phaser.Physics.P2JS);
        this.masterStage.physics.p2.enable(this.dragArea, true);
    }

    startDragMotion():void {
        this.masterStage.input.onDown.add(this.bindDragAreaMotion, this);
        this.masterStage.input.onUp.add(this.unbindDragAreaMotion, this);
        //this.masterStage.input.addMoveCallback(this.hoverDragAreaMotion, this);
        this.masterStage.dragStartCallback("waiting");
    }

    finishDragMotion():void {
        this.card.remove();
        this.motion.finish();
        this.masterStage.input.deleteMoveCallback(this.motionAction);
        this.masterStage.input.deleteMoveCallback(this.resetMotion);
        this.masterStage.input.onDown.remove(this.bindDragAreaMotion, this);
        this.masterStage.input.onUp.remove(this.unbindDragAreaMotion, this);
        this.motionAction = null;
        this.resetMotion = null;
        this.masterStage.dragFinishCallback("opened");
    }

    hoverDragAreaMotion(pointer:Object):void {
        /* 觸發區 hover
         var bodies = this.masterStage.physics.p2.hitTest(pointer.position, this.dragArea);

         if (bodies.length < 1)
         console.log("out");
         else
         console.log("over");*/
    }

    bindDragAreaMotion(pointer:Object):void {
        var bodies = this.masterStage.physics.p2.hitTest(pointer.position, this.dragArea);
        if (bodies.length) {
            this.motionAction = bodies[0].parent.sprite.dragMotion;
            this.resetMotion = bodies[0].parent.sprite.resetMotion;
            this.masterStage.input.addMoveCallback(this.motionAction);
            this.masterStage.dragStartCallback("drag", pointer.x, pointer.y);
        }
    }

    unbindDragAreaMotion(pointer:Object):void {
        if (typeof this.resetMotion === "function") {
            if (typeof this.motionAction == "function") {
                this.masterStage.input.deleteMoveCallback(this.motionAction);
                this.motionAction = null;
            }
            this.resetMotion(pointer);
            this.masterStage.input.deleteMoveCallback(this.resetMotion);
            this.resetMotion = null;
        }
    }
}
