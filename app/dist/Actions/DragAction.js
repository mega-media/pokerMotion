/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/8.
 */
import Card         from '../Components/Card';
import Motion       from '../Components/Motion';
import Top          from './DragArea/Top';
import Right        from './DragArea/Right';
import Bottom       from './DragArea/Bottom';
import Left         from './DragArea/Left';
import TopRight     from './DragArea/TopRight';
import BottomRight  from './DragArea/BottomRight';
import TopLeft      from './DragArea/TopLeft';
import BottomLeft  from './DragArea/BottomLeft';

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

    /* 寫入所有觸發區 */
    _registerComponents():void {
        this.dragArea.push(
            new Top(this.masterStage, this.card, this.motion),
            new Right(this.masterStage, this.card, this.motion),
            new Bottom(this.masterStage, this.card, this.motion),
            new Left(this.masterStage, this.card, this.motion),
            new TopRight(this.masterStage, this.card, this.motion),
            new TopLeft(this.masterStage, this.card, this.motion),
            new BottomRight(this.masterStage, this.card, this.motion),
            new BottomLeft(this.masterStage, this.card, this.motion)
        );
        this.dragArea = this.dragArea.map(area => {
            /* 綁定開牌後行為 */
            area.finishCallback = this.finishDragMotion.bind(this);
            return area.getTriggerArea();
        });
        this.masterStage.physics.startSystem(Phaser.Physics.P2JS);
        this.masterStage.physics.p2.setImpactEvents(true);
        this.masterStage.physics.p2.enable(this.dragArea);

        /* 解除碰撞事件 */
        this.dragArea.forEach(sprite => {
            sprite.body.collides({}, () => {
            }, this);
        });
    }

    /**
     * 綁定事件
     */
    startDragMotion():void {
        this.masterStage.input.onDown.add(this.bindDragAreaMotion, this);
        this.masterStage.input.onUp.add(this.unbindDragAreaMotion, this);
        this.masterStage.input.addMoveCallback(this.hoverDragAreaMotion, this);
        /* callback */
        this.masterStage.dragPendingCallback();
    }

    /**
     * 直接開牌，解除所有綁定
     */
    finishDragMotion():void {
        this.card.remove();
        this.motion.finish();
        this.masterStage.input.deleteMoveCallback(this.motionAction, this);
        this.masterStage.input.deleteMoveCallback(this.resetMotion, this);
        this.masterStage.input.deleteMoveCallback(this.hoverDragAreaMotion, this);
        this.masterStage.input.onDown.removeAll();
        this.masterStage.input.onUp.removeAll();
        this.motionAction = null;
        this.resetMotion = null;
        /* callback */
        this.masterStage.dragFinishCallback();
    }

    /**
     * 滑鼠 hover
     * @param pointer
     */
    hoverDragAreaMotion(pointer:Object):void {
        var bodies = this.masterStage.physics.p2.hitTest(pointer.position, this.dragArea);
        if (bodies.length < 1)
            this.masterStage.canvas.style.cursor = "default";
        else
            this.masterStage.canvas.style.cursor = "pointer";
    }

    /**
     * 觸發區拖曳事件
     * @param pointer
     */
    bindDragAreaMotion(pointer:Object):void {
        var bodies = this.masterStage.physics.p2.hitTest(pointer.position, this.dragArea);
        if (bodies.length) {
            this.motionAction = bodies[0].parent.sprite.dragMotion;
            this.resetMotion = bodies[0].parent.sprite.resetMotion;
            this.masterStage.input.addMoveCallback(this.motionAction, this);
            this.masterStage.dragStartCallback(pointer.x, pointer.y);
        }
    }

    /**
     * 滑鼠離開，回復原狀
     * @param pointer
     */
    unbindDragAreaMotion(pointer:Object):void {
        if (typeof this.resetMotion === "function") {
            if (typeof this.motionAction == "function") {
                this.masterStage.input.deleteMoveCallback(this.motionAction, this);
                this.motionAction = null;
            }
            this.resetMotion(pointer);
            this.masterStage.input.deleteMoveCallback(this.resetMotion, this);
            this.resetMotion = null;
        }
    }
}
