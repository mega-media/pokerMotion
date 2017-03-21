/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/14
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
    CARD_IMAGE,
    MOTION_IMAGE
}  from '../Constants/Constants';
import {angleBetweenPoints}     from '../Helpers/Points';

export default class Motion {
    masterStage:Object;
    cardIndex:number;
    positions:{
        [key:string]:Array<number>
    };
    selfStage:?Object;
    direction:?("TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_RIGHT" | "BOTTOM_LEFT" | "TOP" | "RIGHT" | "BOTTOM" | "LEFT");

    constructor(masterStage:Object) {
        this.masterStage = masterStage;
        this.positions = {};
        this.direction = null;
        this.selfStage = null;
        this.cardIndex = this.getCardIndex();
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
        /* 移除舊的 stage */
        this.remove();
        /* 開牌 */
        this.render("opened");
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

    render(status?:string = 'default'):void {
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
            this.selfStage = this.masterStage.add.sprite(padding, padding, status === "opened" ? CARD_IMAGE : MOTION_IMAGE, this.cardIndex);
            this.selfStage.width = this.masterStage.width - (2 * padding);
            this.selfStage.height = this.masterStage.height - (2 * padding);
        }
        this.selfStage = Object.assign(this.selfStage, maskSprite);
        this.selfStage.mask = pokerMask;
        this.selfStage.anchor.setTo(this.selfStage.anchorX, this.selfStage.anchorY);
    }

    getCardIndex():number {
        const {cardCode} = this.masterStage;
        const color = cardCode.charAt(0);
        const number = parseInt(cardCode.slice(1, cardCode.length)) - 1;
        let code = 0;
        if (number <= 13 && number >= 0) {
            switch (color) {
                case "S":
                    /* 黑桃 */
                    code = (12 - number) + 4 * 13;
                    break;
                case "H":
                    /* 紅心 */
                    code = (12 - number) + 3 * 13;
                    break;
                case "D":
                    /* 方塊 */
                    code = (12 - number) + 13;
                    break;
                case "C":
                    /* 梅花 */
                    code = (12 - number) + 2 * 13;
                    break;
            }
        }
        return code;
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
