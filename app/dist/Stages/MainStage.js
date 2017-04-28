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

    constructor(masterStage:Object) {
        this.masterStage = masterStage;
        this.effect = "default";
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
            /* 繪製卡牌 */
            const card = new Card(this.masterStage);
            card.initialize();
            /* 繪製移動區 */
            const motion = new Motion(this.masterStage);
            /* 啟動拖曳事件 */
            const dragAction = new DragAction(this.masterStage, card, motion);
            dragAction.startDragMotion();
            /* 將開牌寫入 masterStage.finish */
            this.masterStage.finish = dragAction.finishDragMotion.bind(dragAction);
        } else {
            /* 卡牌轉向 */
            const {direction, element:{masterSize, width, height}} = this.masterStage;
            const {originPosition:{POS_TOP_LEFT}} = new Card(this.masterStage);

            const sprite = this.masterStage.add.sprite(POS_TOP_LEFT[0], POS_TOP_LEFT[1], CARD_IMAGE, direction === "v" ? 12 : 0);
            sprite.width = width;
            sprite.height = height;
            sprite.x = masterSize / 2;
            sprite.y = masterSize / 2;
            sprite.anchor.setTo(0.5, 0.5);

            this.masterStage.add.tween(sprite).to({
                angle: direction === "v" ? 90 : -90
            }, 800, Phaser.Easing.Linear.None, true);
        }
    }
}
