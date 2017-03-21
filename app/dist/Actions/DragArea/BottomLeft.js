/**
 * Created by arShown on 2017/3/11.
 */
import Base                           from './Base';
import {
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

export default class BottomLeft extends Base {
    originPosition:Array<number>;

    constructor(masterStage:Object, card:Card, motion:Motion) {
        super(masterStage, card, motion);

        /* 基準點：左下 */
        const {height, padding} = masterStage;
        this.originPosition = [padding, height - padding];
    }

    /**
     * 觸發區塊
     * @returns {*}
     */
    getTriggerArea():Object {
        const {width, height, padding} = this.masterStage;
        const [originX, originY] = this.originPosition;
        const areaSizeWidth = parseInt((width - 2 * padding) / 4),
            areaSizeHeight = parseInt((height - 2 * padding) / 6);
        return super.getTriggerArea(areaSizeWidth, areaSizeHeight, originX + (areaSizeWidth / 2), originY - (areaSizeHeight / 2));
    }

    /**
     * 檢查是不是符合開牌範圍
     */
    isTimeToOpen(pointer:Object):boolean {
        const {width, height} = this.masterStage;
        return pointer.x >= (width / 3 * 2) || pointer.y <= (height / 3);
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
        const [originX, originY] = this.originPosition;
        const pointY = Math.min(pointer.y, originY);
        const pointX = Math.max(pointer.x, originX);
        this.render(pointX, pointY);
    }

    /**
     * 自動開牌
     */
    openMotion(pointer:Object):?void {
        if (!this.motionFlag) {
            return null;
        }
        this.motionFlag = false;

        const [originX, originY] = this.originPosition;
        const {width, padding} = this.masterStage;
        /*
         * 觸發時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        x = Math.max(x, originX);
        y = Math.min(y, originY);

        /* parent */
        super.openMotion({x, y});

        const [startX, startY] = [x, y],
            sizeX = Math.abs(originX - startX),
            sizeY = Math.abs(originY - startY),
            intervalLimit = 100;

        /* 判斷展開方向 */
        if (sizeX >= sizeY) {
            /* 往右 */
            const endX = width - padding,
                limit = Math.abs(zeroThrow(endX - startX, intervalLimit));
            this.bindInterval(function () {
                if (x >= endX) {
                    return this.finishInterval();
                }
                x = parseFloat(x + limit);
                this.render(x, Math.min(originY, startY - zeroThrow(((x - startX) * (originY - startY)), (startX - endX))));
            }.bind(this));
        } else {
            /* 往上 */
            const endY = padding,
                limit = Math.abs(zeroThrow(endY - startY, intervalLimit));
            this.bindInterval(function () {
                if (y <= endY) {
                    return this.finishInterval();
                }
                y = parseFloat(y - limit);
                this.render(Math.max(originX, startX - zeroThrow(((y - startY) * (originX - startX)), (startY - endY))), y);
            }.bind(this));
        }
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

        const [originX, originY] = this.originPosition;
        /*
         * 放開時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        x = Math.max(x, originX);
        y = Math.min(y, originY);

        /* parent */
        super.resetMotion({x, y});

        const [startX, startY] = [x, y],
            sizeX = originX - startX,
            sizeY = originY - startY,
            intervalLimit = 100,
            endX = originX,
            endY = originY;

        //重置
        if (sizeX >= sizeY) {
            /* 往左 */
            const limit = Math.abs(zeroThrow(sizeX, intervalLimit));
            this.bindInterval(function () {
                if (x <= endX) {
                    return this.restoreInterval();
                }
                x = parseFloat(x - limit);
                this.render(x, startY + zeroThrow(((x - startX) * (originY - startY)), (originX - startX)));
            }.bind(this));
        } else {
            /* 往下 */
            const limit = Math.abs(zeroThrow(sizeY, intervalLimit));
            this.bindInterval(function () {
                if (y >= endY) {
                    return this.restoreInterval();
                }
                y = parseFloat(y + limit);
                this.render(startX + zeroThrow(((y - startY) * (originX - startX)), (originY - startY)), y);
            }.bind(this));
        }
    }

    /**
     * 渲染
     * @param pointX
     * @param pointY
     */
    render(pointX:number, pointY:number):void {
        this.motion.direction = this.card.direction = BOTTOM_LEFT;
        const [originX, originY] = this.originPosition;
        const {width, height, padding} = this.masterStage;

        /* 碰到邊界 */
        pointX = Math.max(pointX, originX + 1);
        pointY = Math.min(pointY, originY - 1);

        const {sizeLeft, sizeRight} = sizeBetweenPoints(pointX, originX, pointY, originY);
        const unSlope = unSlopeBetweenPoints(originX, pointX, originY, pointY);

        /**
         * 取對稱點
         */
        const mirrorPosition = getMirrorPosition(originX, pointX, originY, pointY);

        /**
         * 取兩線相交的點
         */
        const getIntersectPosition = function (a, b, c) {
            const {x, y} = middleBetweenPoints(originX, pointX, originY, pointY);
            return this.getMiddleBetweenAndIntersectPosition(unSlope, x, y, a, b, c);
        }.bind(this);
        /*
         * 生成路徑
         */
        const cardPositionData = {};
        const positionData = {};
        if (sizeRight > (height - (2 * padding))) {
            const {mirrorX, mirrorY} = mirrorPosition(originX, padding);
            /*
             * 生成左四邊形路徑
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
            /* 移動區元件 */
            positionData[TOP_LEFT] = getIntersectPosition(0, 1, originX);
            positionData[TOP_RIGHT] = [mirrorX, mirrorY];
            positionData[BOTTOM_RIGHT] = [pointX, pointY];
            positionData[BOTTOM_LEFT] = getIntersectPosition(0, 1, originY);
            positionData[ANOTHER_POS] = [];
            /* 卡片元件 */
            cardPositionData[TOP_LEFT] = getIntersectPosition(0, 1, originX);
            cardPositionData[BOTTOM_LEFT] = getIntersectPosition(0, 1, originY);
            cardPositionData[BOTTOM_RIGHT] = [width - padding, originY];
            cardPositionData[ANOTHER_POS] = [];
            cardPositionData[TOP_RIGHT] = [width - padding, padding];
        }
        else if (sizeLeft > (width - (2 * padding))) {
            const {mirrorX, mirrorY} = mirrorPosition(width - padding, originY);
            /*
             * 生成下四邊形路徑
             * A - - - - - - - - - B
             * |                   |
             * |                   |
             * C - - - - - - - - - D
             * |                   |
             * E - - - - - - - - - F
             *
             * positionData
             * --
             * TOP_LEFT     = F
             * TOP_RIGHT    = E
             * BOTTOM_RIGHT = C
             * BOTTOM_LEFT  = D
             *
             * cardPositionData
             * --
             * TOP_LEFT     = A
             * BOTTOM_LEFT  = E
             * BOTTOM_RIGHT = F
             * TOP_RIGHT    = B
             */

            /* 移動區元件 */
            positionData[TOP_LEFT] = getIntersectPosition(1, 0, originY);
            positionData[TOP_RIGHT] = getIntersectPosition(1, 0, originX);
            positionData[BOTTOM_RIGHT] = [pointX, pointY];
            positionData[BOTTOM_LEFT] = [mirrorX, mirrorY];
            positionData[ANOTHER_POS] = [];

            /* 卡片元件 */
            cardPositionData[TOP_LEFT] = [originX, padding];
            cardPositionData[BOTTOM_LEFT] = getIntersectPosition(1, 0, originX);
            cardPositionData[BOTTOM_RIGHT] = getIntersectPosition(1, 0, originY);
            cardPositionData[ANOTHER_POS] = [];
            cardPositionData[TOP_RIGHT] = [width - padding, padding];
        } else {
            /*
             * 生成三角形路徑
             * A - - - - - - - - - B
             * |                   |
             * |                   |
             * |                   |
             * C - - - D           |
             *  ＼    |           |
             *    ＼  |           |
             *        E - - - - -  F
             *
             * positionData
             * --
             * TOP_RIGHT    = C
             * BOTTOM_RIGHT = D
             * BOTTOM_LEFT  = E
             *
             * cardPositionData
             * --
             * TOP_LEFT     = A
             * BOTTOM_LEFT  = C
             * BOTTOM_RIGHT = E
             * ANOTHER_POS  = F
             * TOP_RIGHT    = B
             */
            /* 移動區元件 */
            positionData[TOP_LEFT] = [];
            positionData[TOP_RIGHT] = getIntersectPosition(1, 0, originX);
            positionData[BOTTOM_RIGHT] = [pointX, pointY];
            positionData[BOTTOM_LEFT] = getIntersectPosition(0, 1, originY);
            positionData[ANOTHER_POS] = [];

            /* 卡片元件 */
            cardPositionData[TOP_LEFT] = [originX, padding];
            cardPositionData[BOTTOM_LEFT] = getIntersectPosition(1, 0, originX);
            cardPositionData[BOTTOM_RIGHT] = getIntersectPosition(0, 1, originY);
            cardPositionData[ANOTHER_POS] = [width - padding, originY];
            cardPositionData[TOP_RIGHT] = [width - padding, padding];
        }
        /* 呼叫繪製 */
        this.card.update(cardPositionData[TOP_LEFT], cardPositionData[TOP_RIGHT], cardPositionData[BOTTOM_RIGHT], cardPositionData[BOTTOM_LEFT], cardPositionData[ANOTHER_POS]);
        this.motion.update(positionData[TOP_LEFT], positionData[TOP_RIGHT], positionData[BOTTOM_RIGHT], positionData[BOTTOM_LEFT], positionData[ANOTHER_POS]);
    }
}
