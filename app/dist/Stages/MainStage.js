/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/8.
 */
import Card from '../Components/Card';
import Motion from '../Components/Motion';
import DragAction from '../Actions/DragAction';
import {CARD_IMAGE, MOTION_IMAGE} from '../Constants/Constants';

export default class MainStage {
    masterStage:Object;
    cardImg:string;

    constructor(masterStage:Object, cardImg:string) {
        this.masterStage = masterStage;
        this.cardImg = cardImg;
    }

    /**
     * 預載
     */
    preload():void {
        this.masterStage.load.image(CARD_IMAGE, "assets/images/pokerCover.jpg");
        this.masterStage.load.image(MOTION_IMAGE, "assets/images/" + this.cardImg);
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
