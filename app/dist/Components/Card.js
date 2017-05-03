/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/4/28
 */
import {
    TOP_LEFT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    ANOTHER_POS,
    TOP_RIGHT,
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

    get originPosition():Object {
        const {element:{width, height, masterSize}} = this.masterStage;
        return {
            POS_TOP_LEFT: [(masterSize - width) / 2, (masterSize - height) / 2],
            POS_TOP_RIGHT: [(masterSize + width) / 2, (masterSize - height) / 2],
            POS_BOTTOM_RIGHT: [(masterSize + width) / 2, (masterSize + height) / 2],
            POS_BOTTOM_LEFT: [(masterSize - width) / 2, (masterSize + height) / 2]
        }
    }

    restore():void {
        this.positions = {};
        this.initialize();
    }

    initialize():void {
        const {POS_TOP_LEFT, POS_TOP_RIGHT, POS_BOTTOM_RIGHT, POS_BOTTOM_LEFT} = this.originPosition;
        this.positions = {
            TOP_LEFT: POS_TOP_LEFT,
            TOP_RIGHT: POS_TOP_RIGHT,
            BOTTOM_RIGHT: POS_BOTTOM_RIGHT,
            BOTTOM_LEFT: POS_BOTTOM_LEFT,
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
        const {element:{width, height}, direction} = this.masterStage;
        /* 卡牌元件 */
        if (!this.selfStage) {
            const {POS_TOP_LEFT} = this.originPosition;
            this.selfStage = this.masterStage.add.sprite(POS_TOP_LEFT[0], POS_TOP_LEFT[1], CARD_IMAGE, direction === "v" ? 12 : 0);
            this.selfStage.width = width;
            this.selfStage.height = height;
        }
        const stage:Object = this.selfStage;
        stage.mask = null;
        /* 遮罩 */
        if (Object.keys(this.positions).length) {
            const pokerMask = new Phaser.Graphics(this.masterStage);
            pokerMask.beginFill(0xffffff);
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
