/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/8.
 */
import {RIGHT, TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT, BOTTOM_LEFT, ANOTHER_POS, CARD_IMAGE} from '../Constants/Constants';

export default class Card {
    masterStage:Object;
    positions:{
        [key:string]:Array<number>
    };
    direction:?("TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_RIGHT" | "BOTTOM_LEFT" | "RIGHT");
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

    _getKeySort():Array<string> {
        let keySort = [];
        switch (this.direction) {
            case BOTTOM_RIGHT:
                keySort = [
                    TOP_LEFT,
                    BOTTOM_LEFT,
                    BOTTOM_RIGHT,
                    ANOTHER_POS,
                    TOP_RIGHT
                ];
                break;
            default:
                keySort = [
                    TOP_LEFT,
                    BOTTOM_LEFT,
                    BOTTOM_RIGHT,
                    TOP_RIGHT
                ];
                break;
        }
        return keySort;
    }

    render():void {
        const {padding} = this.masterStage;
        /* 卡牌元件 */
        if (!this.selfStage) {
            this.selfStage = this.masterStage.add.sprite(padding, padding, CARD_IMAGE);
            this.selfStage.width = this.masterStage.width - (2 * padding);
            this.selfStage.height = this.masterStage.height - (2 * padding);
        }
        const stage:Object = this.selfStage;
        stage.mask = null;
        /* 遮罩 */
        if (Object.keys(this.positions).length) {
            const pokerMask = new Phaser.Graphics(this.masterStage);
            let keySort = this._getKeySort();
            let firstPos = [];
            keySort.map(key => {
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
