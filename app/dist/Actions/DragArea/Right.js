/**
 * Created by arShown on 2017/3/10.
 */
import Base                           from './Base';
import {
    RIGHT,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_RIGHT,
    BOTTOM_LEFT,
    ANOTHER_POS
} from '../../Constants/Constants';
import Card                           from '../../Components/Card';
import Motion                         from '../../Components/Motion';
import {zeroThrow}                    from '../../Helpers/Points';

export default class Right extends Base {
    originPosition:{
        originX:number,
        topY:number,
        bottomY:number
    };

    constructor(masterStage:Object, card:Card, motion:Motion) {
        super(masterStage, card, motion);

        /* 基準點: 右 */
        const {width, height, padding} = masterStage;
        this.originPosition = {
            originX: width - padding,
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
        const {originX} = this.originPosition;

        const areaSizeHeightBlock = parseInt((height - 2 * padding) / 6),
            areaSizeWidth = parseInt((width - 2 * padding) / 4),
            areaSizeHeight = height - 2 * (padding + areaSizeHeightBlock);
        return super.getTriggerArea(areaSizeWidth, areaSizeHeight, originX - (areaSizeWidth / 2), padding + (areaSizeHeight / 2) + areaSizeHeightBlock);
    }

    /**
     * 檢查是不是符合開牌範圍
     */
    isTimeToOpen(pointer:Object):boolean {
        const {width} = this.masterStage;
        return pointer.x <= (width / 2);
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
        const pointX = Math.min(pointer.x, originX);
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

        const {originX, topY, bottomY} = this.originPosition;
        const {padding} = this.masterStage;
        /*
         * 觸發時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        x = Math.min(x, originX);

        /* parent */
        super.openMotion({x, y});

        const limit = Math.abs(zeroThrow(padding - x, 100));
        this.bindInterval(function () {
            if (x <= padding) {
                return this.finishInterval();
            }
            x = parseFloat(x - limit);
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

        const {originX, topY, bottomY} = this.originPosition;

        /*
         * 放開時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        x = Math.min(x, originX);

        /* parent */
        super.resetMotion({x, y});

        const limit = Math.abs(zeroThrow(originX - x, 100));
        this.bindInterval(function () {
            if (x >= originX) {
                return this.restoreInterval();
            }
            x = parseFloat(x + limit);
            this.render(x);
        }.bind(this));

    }

    /**
     * 渲染
     * @param pointX
     * @param pointY
     */
    render(pointX:number):void {
        this.motion.direction = this.card.direction = RIGHT;
        const {width, height, padding} = this.masterStage;
        const {originX, topY, bottomY} = this.originPosition;
        /* 碰到邊界 */
        pointX = Math.min(pointX, originX - 1);

        /*
         * 生成路徑
         */
        const cardPositionData = {};
        const positionData = {};
        /*
         * 生成右四邊形路徑
         */

        /* 移動區元件 */
        positionData[TOP_LEFT] = [pointX, topY];
        positionData[TOP_RIGHT] = [(originX + pointX) / 2, topY];
        positionData[BOTTOM_RIGHT] = [(originX + pointX) / 2, bottomY];
        positionData[BOTTOM_LEFT] = [pointX, bottomY];
        positionData[ANOTHER_POS] = [];
        /* 卡片元件 */
        cardPositionData[TOP_LEFT] = [0, 0];
        cardPositionData[TOP_RIGHT] = [pointX, topY];
        cardPositionData[BOTTOM_RIGHT] = [pointX, bottomY];
        cardPositionData[BOTTOM_LEFT] = [0, bottomY];
        cardPositionData[ANOTHER_POS] = [];

        /* 呼叫繪製 */
        this.card.update(cardPositionData[TOP_LEFT], cardPositionData[TOP_RIGHT], cardPositionData[BOTTOM_RIGHT], cardPositionData[BOTTOM_LEFT], cardPositionData[ANOTHER_POS]);
        this.motion.update(positionData[TOP_LEFT], positionData[TOP_RIGHT], positionData[BOTTOM_RIGHT], positionData[BOTTOM_LEFT], positionData[ANOTHER_POS]);
    }
}
