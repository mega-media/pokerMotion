/**
 * Created by arShown on 2016/6/8.
 * Updated on 2017/3/8.
 */
import Base                           from './Base';
import {
    BOTTOM,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_RIGHT,
    BOTTOM_LEFT,
    ANOTHER_POS
} from '../../Constants/Constants';
import Card                           from '../../Components/Card';
import Motion                         from '../../Components/Motion';
import {
    sizeBetweenPoints,
    unSlopeBetweenPoints,
    distanceBetweenPoints,
    middleBetweenPoints,
    getMirrorPosition,
    zeroThrow
} from '../../Helpers/Points';

export default class Bottom extends Base {
    originPosition:{
        topY:number,
        originY:number,
        leftX:number,
        rightX:number
    };

    constructor(masterStage:Object, card:Card, motion:Motion) {
        super(masterStage, card, motion);

        /* 基準點：右下 */
        const {width, height, padding} = masterStage;
        this.originPosition = {
            topY: padding,
            originY: height - padding, 
            leftX: padding,
            rightX: width - padding
        };
    }

    /**
     * 觸發區塊
     * @returns {*}
     */
    getTriggerArea():Object {
        const {width, height, padding} = this.masterStage;
        const {originY, leftX} = this.originPosition;

        const areaSizeWidthBlock = parseInt((width - 2 * padding) / 4),
            areaSizeWidth = width - 2 * (padding + areaSizeWidthBlock),
            areaSizeHeight = parseInt((height - 2 * padding) / 6);
        return super.getTriggerArea(areaSizeWidth, areaSizeHeight, leftX + (areaSizeWidth / 2) + areaSizeWidthBlock, originY - (areaSizeHeight / 2));
    }

    /**
     * 檢查是不是符合開牌範圍
     */
    isTimeToOpen(pointer:Object):boolean {
        const {height} = this.masterStage;
        return pointer.y <= (height / 2);
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
        const {originY} = this.originPosition;
        const pointY = Math.min(pointer.y, originY);
        this.render(pointY);
    }

    /**
     * 自動開牌
     */
    openMotion(pointer:Object):?void {
        if (!this.motionFlag) {
            return null;
        }
        this.motionFlag = false;
        const {topY, originY, leftX, rightX} = this.originPosition;
        /*
         * 觸發時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        y = Math.min(y, originY);

        /* parent */
        super.openMotion({x, y});

        const limit = Math.abs(zeroThrow(topY - y, 100));
        this.bindInterval(function () {
            if (y <= topY) {
                return this.finishInterval();
            }
            y = parseFloat(y - limit);
            this.render(y);
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
        const {topY, originY} = this.originPosition;
        /*
         * 放開時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        y = Math.min(y, originY);

        /* parent */
        super.resetMotion({x, y});

        const limit = Math.abs(zeroThrow(originY - topY, 100));
        this.bindInterval(function () {
            if (y >= originY) {
                return this.restoreInterval();
            }
            y = parseFloat(y + limit);
            this.render(y);
        }.bind(this));

    }

    /**
     * 渲染
     * @param pointX
     * @param pointY
     */
    render(pointY:number):void {
        this.motion.direction = this.card.direction = BOTTOM;
        const {topY, originY, leftX, rightX} = this.originPosition;
        /* 碰到邊界 */
        pointY = Math.min(pointY, originY - 1);

        /*
         * 生成路徑
         */
        const cardPositionData = {};
        const positionData = {};

        /* 移動區元件 */
        positionData[TOP_LEFT] = [leftX, (originY + pointY) / 2];
        positionData[TOP_RIGHT] = [rightX, (originY + pointY) / 2];
        positionData[BOTTOM_RIGHT] = [rightX, pointY];
        positionData[BOTTOM_LEFT] = [leftX, pointY];
        positionData[ANOTHER_POS] = [];

        /* 卡片元件 */
        cardPositionData[TOP_LEFT] = [leftX, topY];
        cardPositionData[TOP_RIGHT] = [rightX, topY];
        cardPositionData[BOTTOM_RIGHT] = [rightX, (originY + pointY) / 2];
        cardPositionData[BOTTOM_LEFT] = [leftX, (originY + pointY) / 2];
        cardPositionData[ANOTHER_POS] = [];

        /* 呼叫繪製 */
        this.card.update(cardPositionData[TOP_LEFT], cardPositionData[TOP_RIGHT], cardPositionData[BOTTOM_RIGHT], cardPositionData[BOTTOM_LEFT], cardPositionData[ANOTHER_POS]);
        this.motion.update(positionData[TOP_LEFT], positionData[TOP_RIGHT], positionData[BOTTOM_RIGHT], positionData[BOTTOM_LEFT], positionData[ANOTHER_POS]);
    }
}
