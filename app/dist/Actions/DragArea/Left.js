/**
 * Created by arShown on 2017/3/10.
 */
import Base                           from './Base';
import {
    LEFT,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_RIGHT,
    BOTTOM_LEFT,
    ANOTHER_POS
} from '../../Constants/Constants';
import Card                           from '../../Components/Card';
import Motion                         from '../../Components/Motion';
import {zeroThrow}                    from '../../Helpers/Points';

export default class Left extends Base {
    originPosition:{
        rightX:number,
        originX:number,
        topY:number,
        bottomY:number
    };

    constructor(masterStage:Object, card:Card, motion:Motion) {
        super(masterStage, card, motion);

        /* 基準點: 左 */
        const {width, height, padding} = masterStage;
        this.originPosition = {
            rightX: width - padding,
            originX: padding,
            topY: padding,
            bottomY: height - padding
        };
    }

    /**
     * 觸發區塊
     * @returns {*}
     */
    getTriggerArea():Object {
        const {width, height, padding} = this.masterStage;
        const {originX, topY} = this.originPosition;

        const areaSizeHeightBlock = parseInt((height - 2 * padding) / 6),
            areaSizeWidth = parseInt((width - 2 * padding) / 4),
            areaSizeHeight = height - 2 * (padding + areaSizeHeightBlock);
        return super.getTriggerArea(areaSizeWidth, areaSizeHeight, originX + (areaSizeWidth / 2), topY + (areaSizeHeight / 2) + areaSizeHeightBlock);
    }

    /**
     * 檢查是不是符合開牌範圍
     */
    isTimeToOpen(pointer:Object):boolean {
        const {width} = this.masterStage;
        return pointer.x >= (width / 2);
    }

    /**
     * 拖曳動作
     * @param pointer
     * @returns {null}
     */
    dragMotion(pointer:Object):?void {
        if (!this.motionFlag) {
            return null;
        }
        if (this.isTimeToOpen(pointer)) {
            this.openMotion(pointer);
            return null;
        }
        const {originX} = this.originPosition;
        const pointX = Math.max(pointer.x, originX);
        this.render(pointX);
    }

    /**
     * 自動開牌
     */
    openMotion(pointer:Object):?void {
        if (!this.motionFlag) {
            return null;
        }
        this.motionFlag = false;

        const {originX, rightX} = this.originPosition;
        /*
         * 觸發時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        x = Math.max(x, originX);

        /* parent */
        super.openMotion({x, y});

        const limit = Math.abs(zeroThrow(rightX - x, 100));
        this.bindInterval(function () {
            if (x >= rightX) {
                return this.finishInterval();
            }
            x = parseFloat(x + limit);
            this.render(x);
        }.bind(this));

    }

    /**
     * 放開時回原狀
     * @returns {null}
     */
    resetMotion(pointer:Object):?void {
        if (!this.motionFlag) {
            return null;
        }
        this.motionFlag = false;

        const {originX} = this.originPosition;
        /*
         * 放開時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        x = Math.max(x, originX);

        /* parent */
        super.resetMotion({x, y});

        const limit = Math.abs(zeroThrow(originX - x, 100));
        this.bindInterval(function () {
            if (x <= originX) {
                return this.restoreInterval();
            }
            x = parseFloat(x - limit);
            this.render(x);
        }.bind(this));

    }

    /**
     * 渲染
     * @param pointX
     * @param pointY
     */
    render(pointX:number):void {
        this.motion.direction = this.card.direction = LEFT;
        const {originX, topY, bottomY, rightX} = this.originPosition;
        /* 碰到邊界 */
        pointX = Math.max(pointX, originX + 1);

        /*
         * 生成路徑
         * A - - B - - - - C
         * |     |         |
         * |     |         |
         * |     |         |
         * |     |         |
         * |     |         |
         * |     |         |
         * D - - E - - - - F
         *
         * positionData
         * --
         * TOP_LEFT     = A
         * TOP_RIGHT    = B
         * BOTTOM_RIGHT = E
         * BOTTOM_LEFT  = D
         *
         * cardPositionData
         * --
         * TOP_LEFT     = A
         * BOTTOM_LEFT  = D
         * BOTTOM_RIGHT = F
         * TOP_RIGHT    = C
         */
        const cardPositionData = {}, positionData = {};

        /* 移動區元件 */
        positionData[TOP_LEFT] = [(originX + pointX) / 2, topY];
        positionData[TOP_RIGHT] = [pointX, topY];
        positionData[BOTTOM_RIGHT] = [pointX, bottomY];
        positionData[BOTTOM_LEFT] = [(originX + pointX) / 2, bottomY];
        positionData[ANOTHER_POS] = [];
        /* 卡片元件 */
        cardPositionData[TOP_LEFT] = [(originX + pointX) / 2, topY];
        cardPositionData[BOTTOM_LEFT] = [(originX + pointX) / 2, bottomY];
        cardPositionData[BOTTOM_RIGHT] = [rightX, bottomY];
        cardPositionData[ANOTHER_POS] = [];
        cardPositionData[TOP_RIGHT] = [rightX, topY];

        /* 呼叫繪製 */
        this.card.update(cardPositionData[TOP_LEFT], cardPositionData[TOP_RIGHT], cardPositionData[BOTTOM_RIGHT], cardPositionData[BOTTOM_LEFT], cardPositionData[ANOTHER_POS]);
        this.motion.update(positionData[TOP_LEFT], positionData[TOP_RIGHT], positionData[BOTTOM_RIGHT], positionData[BOTTOM_LEFT], positionData[ANOTHER_POS]);
    }
}
