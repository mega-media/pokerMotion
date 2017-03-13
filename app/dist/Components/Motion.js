/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/8
 */
import {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_RIGHT,
    BOTTOM_LEFT,
    ANOTHER_POS,
    MOTION_IMAGE
}  from '../Constants/Constants';
import StorageLibrary           from '../Libraries/StorageLibrary';
import {angleBetweenPoints}     from '../Helpers/Points';

export default class Motion {
    masterStage:Object;
    cardIndex:number;
    store:StorageLibrary;
    positions:{
        [key:string]:Array<number>
    };
    selfStage:?Object;
    direction:?("TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_RIGHT" | "BOTTOM_LEFT" | "TOP" | "RIGHT" | "BOTTOM" | "LEFT");

    constructor(masterStage:Object, cardImg:string) {
        this.masterStage = masterStage;
        this.store = masterStage.store;
        this.positions = {};
        this.direction = null;
        this.selfStage = null;
        this.cardIndex = this.getCardIndex(cardImg);
    }


    finish():void {
        const {padding} = this.masterStage;
        this.positions = {
            TOP_LEFT: [padding, padding],
            TOP_RIGHT: [this.masterStage.width - padding, padding],
            BOTTOM_RIGHT: [this.masterStage.width - padding, this.masterStage.height - padding],
            BOTTOM_LEFT: [padding, this.masterStage.height - padding],
            ANOTHER_POS: []
        };
        this.direction = null;
        this.render();
    }

    restore():void {
        this.positions = {};
        this.remove();
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
        let maskSprite = {};
        /* 遮罩 */
        const pokerMask = new Phaser.Graphics(this.masterStage);
        if (Object.keys(this.positions).length) {
            let firstPos = [];
            [
                TOP_LEFT,
                TOP_RIGHT,
                BOTTOM_RIGHT,
                BOTTOM_LEFT
            ].forEach(key => {
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
            //遮罩
            maskSprite = this.getMaskSprite();
        }

        /* 元件 */
        if (!this.selfStage) {
            const {padding} = this.masterStage;
            this.selfStage = this.masterStage.add.sprite(padding, padding, MOTION_IMAGE, this.cardIndex);
            this.selfStage.width = this.masterStage.width - (2 * padding);
            this.selfStage.height = this.masterStage.height - (2 * padding);
        }
        this.selfStage = Object.assign(this.selfStage, maskSprite);
        this.selfStage.mask = pokerMask;
        this.selfStage.anchor.setTo(this.selfStage.anchorX, this.selfStage.anchorY);
    }

    getCardIndex(cardImg:string):number {
        return parseInt(Math.random() * 52);
    }

    getMaskSprite():Object {
        let sprite = {};
        switch (this.direction) {
            case BOTTOM_LEFT:
                sprite.angle = angleBetweenPoints(
                    this.positions[BOTTOM_LEFT][0],
                    this.positions[BOTTOM_RIGHT][0],
                    this.positions[BOTTOM_LEFT][1],
                    this.positions[BOTTOM_RIGHT][1]
                );
                sprite.x = this.positions[BOTTOM_RIGHT][0];
                sprite.y = this.positions[BOTTOM_RIGHT][1];
                sprite.anchorX = 0;
                sprite.anchorY = 0;
                break;
            case BOTTOM_RIGHT:
                sprite.angle = angleBetweenPoints(
                    this.positions[BOTTOM_RIGHT][0],
                    this.positions[BOTTOM_LEFT][0],
                    this.positions[BOTTOM_RIGHT][1],
                    this.positions[BOTTOM_LEFT][1]
                );
            case RIGHT:
                sprite.x = this.positions[BOTTOM_LEFT][0];
                sprite.y = this.positions[BOTTOM_LEFT][1];
                sprite.anchorX = 0;
                sprite.anchorY = 1;
                break;
            case BOTTOM:
                sprite.x = this.positions[BOTTOM_LEFT][0];
                sprite.y = this.positions[BOTTOM_LEFT][1];
                sprite.anchorX = 0;
                sprite.anchorY = 0;
                break;
            case LEFT:
                sprite.x = this.positions[TOP_RIGHT][0];
                sprite.y = this.positions[TOP_RIGHT][1];
                sprite.anchorX = 1;
                sprite.anchorY = 0;
                break;
            case TOP:
                sprite.x = this.positions[TOP_LEFT][0];
                sprite.y = this.positions[TOP_LEFT][1];
                sprite.anchorX = 0;
                sprite.anchorY = 1;
                break;
            case TOP_RIGHT:
                sprite.angle = angleBetweenPoints(
                    this.positions[TOP_RIGHT][0],
                    this.positions[TOP_LEFT][0],
                    this.positions[TOP_RIGHT][1],
                    this.positions[TOP_LEFT][1]
                );
                sprite.x = this.positions[TOP_LEFT][0];
                sprite.y = this.positions[TOP_LEFT][1];
                sprite.anchorX = 0;
                sprite.anchorY = 0;
                break;
            case TOP_LEFT:
                sprite.angle = angleBetweenPoints(
                    this.positions[TOP_LEFT][0],
                    this.positions[TOP_RIGHT][0],
                    this.positions[TOP_LEFT][1],
                    this.positions[TOP_RIGHT][1]
                );
                sprite.x = this.positions[TOP_RIGHT][0];
                sprite.y = this.positions[TOP_RIGHT][1];
                sprite.anchorX = 0;
                sprite.anchorY = 1;
                break;
            default:
                const {padding} = this.masterStage;
                sprite.angle = 0;
                sprite.x = padding;
                sprite.y = padding;
                sprite.anchorX = 0;
                sprite.anchorY = 0;
                break;
        }
        return sprite;
    }

    remove() {
        this.masterStage.world.remove(this.selfStage);
        this.selfStage = null;
    }
}
