/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/14
 */
import {
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_RIGHT,
    BOTTOM_LEFT,
    ANOTHER_POS,
    CARD_IMAGE
} from '../Constants/Constants';

export default class Card {
    masterStage:Object;
    positions:{
        [key:string]:Array<number>
    };
    direction:?("TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_RIGHT" | "BOTTOM_LEFT" | "TOP" | "RIGHT" | "BOTTOM" | "LEFT");
    selfStage:?Object;

    constructor(masterStage:Object) {
        this.masterStage = masterStage;
        this.positions = {};
        this.direction = null;
        this.selfStage = null;
    }

    restore():void {
        this.positions = {};
        this.initialize();
    }

    initialize():void {
        const {padding} = this.masterStage;
        this.positions = {
            TOP_LEFT: [padding, padding],
            TOP_RIGHT: [this.masterStage.width - padding, padding],
            BOTTOM_RIGHT: [this.masterStage.width - padding, this.masterStage.height - padding],
            BOTTOM_LEFT: [padding, this.masterStage.height - padding],
            ANOTHER_POS: []
        };
        this.render();
    }

    update(TL:Array<number> = [], TR:Array<number> = [], BR:Array<number> = [], BL:Array<number> = [], AP:Array<number> = []):void {
        this.positions = {
            TOP_LEFT: TL,
            TOP_RIGHT: TR,
            BOTTOM_RIGHT: BR,
            BOTTOM_LEFT: BL,
            ANOTHER_POS: AP
        };
        this.render();
    }

    render():void {
        const {width, height, padding} = this.masterStage;
        /* 卡牌元件 */
        if (!this.selfStage) {
            this.selfStage = this.masterStage.add.sprite(padding, padding, CARD_IMAGE, 12);
            this.selfStage.width = width - (2 * padding);
            this.selfStage.height = height - (2 * padding);
        }
        const stage:Object = this.selfStage;
        stage.mask = null;
        /* 遮罩 */
        if (Object.keys(this.positions).length) {
            const pokerMask = new Phaser.Graphics(this.masterStage);
            let firstPos = [];
            [
                TOP_LEFT,
                BOTTOM_LEFT,
                BOTTOM_RIGHT,
                ANOTHER_POS,
                TOP_RIGHT
            ].map(key => {
                let pos = this.positions[key];
                if (pos.length) {
                    if (firstPos.length === 0) {
                        firstPos = pos;
                        pokerMask.moveTo(pos[0], pos[1]);
                    }
                    pokerMask.lineTo(pos[0], pos[1]);
                }
            });
            pokerMask.lineTo(firstPos[0], firstPos[1]);
            /* 寫入遮罩 */
            stage.mask = pokerMask;
        }
    }

    remove() {
        this.masterStage.world.remove(this.selfStage);
        this.selfStage = null;
    }
}
