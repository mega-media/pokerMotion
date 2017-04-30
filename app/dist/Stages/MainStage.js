/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/14
 */
import path                         from 'path';
import Card                         from '../Components/Card';
import Motion                       from '../Components/Motion';
import DragAction                   from '../Actions/DragAction';
import {CARD_IMAGE, MOTION_IMAGE}   from '../Constants/Constants';

type EffectType = "default" | "turn";

export default class MainStage {
    effect:EffectType;
    masterStage:Object;
    motion:?Motion;
    card:?Card;
    dragAction:?DragAction;

    constructor(masterStage:Object) {
        this.masterStage = masterStage;
        this.effect = "default";
        this.motion = null;
        this.card = null;
        this.dragAction = null;
    }

    init(effect:EffectType = "default", params:Object = {}) {
        this.effect = effect;
        Object.assign(this.masterStage, params);
    }

    /**
     * 預載
     */
    preload():void {
        const {backgroundColor, assertUrl, direction} = this.masterStage;
        if (direction === "v") {
            this.masterStage.load.spritesheet(CARD_IMAGE, path.resolve(__dirname, `${assertUrl}/poker.svg`), 216.2, 328);
            this.masterStage.load.spritesheet(MOTION_IMAGE, path.resolve(__dirname, `${assertUrl}/pokerNoNumber.svg`), 216.2, 328);
        } else {
            this.masterStage.load.spritesheet(CARD_IMAGE, path.resolve(__dirname, `${assertUrl}/poker_horizontal.svg`), 328, 216.2);
            this.masterStage.load.spritesheet(MOTION_IMAGE, path.resolve(__dirname, `${assertUrl}/pokerNoNumber_horizontal.svg`), 328, 216.2);
        }
        this.masterStage.stage.backgroundColor = backgroundColor;
    }

    /**
     * 舞台建立
     */
    create():void {
        if (this.effect === "default") {
            /* 有的話先移除 */
            this.card && this.card.remove();
            this.motion && this.motion.remove();
            this.dragAction && this.dragAction.restore();
            /* 繪製卡牌 */
            this.card = new Card(this.masterStage);
            this.card.initialize();
            /* 繪製移動區 */
            this.motion = new Motion(this.masterStage);
            /* 啟動拖曳事件 */
            this.dragAction = new DragAction(this.masterStage, this.card, this.motion);
            this.dragAction.startDragMotion();
            /* 將開牌寫入 masterStage.finish */
            this.masterStage.finish = this.dragAction.finishDragMotion.bind(this.dragAction);
        } else {
            /* 有的話先移除 */
            this.motion && this.motion.remove();
            this.dragAction && this.dragAction.restore();
            /* 卡牌轉向 */
            const {element:{masterSize}} = this.masterStage;
            const {selfStage:CardStage} = this.card;
            CardStage.mask = null;
            CardStage.x = masterSize / 2;
            CardStage.y = masterSize / 2;
            CardStage.anchor.setTo(0.5, 0.5);
            this.masterStage.add.tween(CardStage).to({
                angle: 90
            }, 500, Phaser.Easing.Linear.None, true);
        }
    }
}
