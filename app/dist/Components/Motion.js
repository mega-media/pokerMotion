/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/8
 */
import {TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT, BOTTOM_LEFT, ANOTHER_POS, MOTION_IMAGE}  from '../Constants/Constants';
import StorageLibrary                                                               from '../Libraries/StorageLibrary';
import {angleBetweenPoints}                                                         from '../Helpers/Points';

export default class Motion {
    masterStage:Object;
    store:StorageLibrary;
    positions:{
        [key:string]:Array<number>
    };
    selfStage:?Object;
    direction:?("TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_RIGHT" | "BOTTOM_LEFT");

    constructor(masterStage:Object) {
        this.masterStage = masterStage;
        this.store = masterStage.store;
        this.positions = {};
        this.direction = null;
        this.selfStage = null;
    }

    restore():void {
        this.positions = {};
        this.direction = null;
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
        const {padding} = this.masterStage, keySort = this.compute(), sprite = {};
        /* 遮罩 */
        const pokerMask = new Phaser.Graphics(this.masterStage);
        if (Object.keys(this.positions).length) {
            let firstPos = [];
            keySort.forEach(key => {
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

            sprite.x = this.positions[BOTTOM_LEFT][0];
            sprite.y = this.positions[BOTTOM_LEFT][1];
            sprite.anchorX = 0;
            sprite.anchorY = 1;
            sprite.angle = angleBetweenPoints(
                this.positions[BOTTOM_RIGHT][0],
                this.positions[BOTTOM_LEFT][0],
                this.positions[BOTTOM_RIGHT][1],
                this.positions[BOTTOM_LEFT][1]
            );
        }
        /* 元件 */
        if (!this.selfStage) {
            this.selfStage = this.masterStage.add.sprite(padding, padding, MOTION_IMAGE);
            this.selfStage.width = this.masterStage.width - (2 * padding);
            this.selfStage.height = this.masterStage.height - (2 * padding);
        }
        this.selfStage = Object.assign(this.selfStage, sprite);
        this.selfStage.mask = pokerMask;
        this.selfStage.anchor.setTo(this.selfStage.anchorX, this.selfStage.anchorY);

        /* 紀錄點座標 */
        this.masterStage.store.set("motion", {
            positions: this.positions
        });
    }

    compute():Array<string> {
        let keySort = [];
        switch (this.direction) {
            case TOP_RIGHT:
                break;
            case BOTTOM_RIGHT:
            default:
                keySort = [
                    BOTTOM_LEFT,
                    BOTTOM_RIGHT,
                    TOP_RIGHT,
                    TOP_LEFT
                ];
                break;
        }
        return keySort;
    }
}
