/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/14
 */
import path                         from 'path';
import Card                         from '../Components/Card';
import Motion                       from '../Components/Motion';
import DragAction                   from '../Actions/DragAction';
import {CARD_IMAGE, MOTION_IMAGE}   from '../Constants/Constants';

export default class MainStage {
    masterStage:Object;

    constructor(masterStage:Object) {
        this.masterStage = masterStage;
    }

    /**
     * 預載
     */
    preload():void {
        const {backgroundColor, assertUrl} = this.masterStage;
        this.masterStage.load.spritesheet(CARD_IMAGE, path.resolve(__dirname, `${assertUrl}/poker.svg`), 216.2, 328);
        this.masterStage.load.spritesheet(MOTION_IMAGE, path.resolve(__dirname, `${assertUrl}/pokerNoNumber.svg`), 216.2, 328);
        this.masterStage.stage.backgroundColor = backgroundColor;
    }

    /**
     * 舞台建立
     */
    create():void {
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
    }

}
