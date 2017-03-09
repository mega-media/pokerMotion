/**
 * Created by arShown on 2016/6/8.
 * Updated on 2017/3/8.
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
    zeroThrow
} from '../../Helpers/Points';

export default class BottomRight extends Base {
    constructor(masterStage:Object, card:Card, motion:Motion) {
        super(masterStage, card, motion);
        this.motion.direction = this.card.direction = BOTTOM_RIGHT;
    }

    /**
     * 觸發區塊
     * @returns {*}
     */
    getTriggerArea():Object {
        const {width, height, padding} = this.masterStage;
        const areaSize = 100;
        return super.getTriggerArea(areaSize, areaSize, (width - padding) - (areaSize / 2), (height - padding) - (areaSize / 2));
    }

    /**
     * 檢查是不是符合開牌範圍
     */
    isTimeToOpen(pointer:Object):boolean {
        const {width, height, padding} = this.masterStage;
        return pointer.x <= (width / 3) || pointer.y <= (height / 3);
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
        const {width, height, padding} = this.masterStage;
        const pointY = Math.min(pointer.y, (height - padding));
        const pointX = Math.min(pointer.x, (width - padding));
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

        const {width, height, padding} = this.masterStage;
        /*
         * 觸發時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        x = Math.min(x, width - padding);
        y = Math.min(y, height - padding);

        /* parent */
        super.openMotion({x, y});

        const [startX, startY] = [x, y],
            sizeX = (width - padding) - startX,
            sizeY = (height - padding) - startY,
            intervalLimit = 100;

        /* 判斷展開方向 */
        if (sizeX >= sizeY) {
            /* 往左 */
            const endX = padding,
                limit = Math.abs(zeroThrow(endX - startX, intervalLimit));
            this.bindInterval(function () {
                if (x <= endX) {
                    return this.finishInterval();
                }
                x = parseFloat(x - limit);
                this.render(x, Math.min((height - padding), startY - zeroThrow(((x - startX) * ((height - padding) - startY)), (startX - padding))));
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
                this.render(Math.min((width - padding), startX - zeroThrow(((y - startY) * ((width - padding) - startX)), (startY - padding))), y);
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

        const {width, height, padding} = this.masterStage;
        /*
         * 放開時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        x = Math.min(x, width - padding);
        y = Math.min(y, height - padding);

        /* parent */
        super.resetMotion({x, y});

        const [startX, startY] = [x, y],
            sizeX = (width - padding) - startX,
            sizeY = (height - padding) - startY,
            intervalLimit = 100,
            endX = width - padding,
            endY = height - padding;

        //重置
        if (sizeX >= sizeY) {
            /* 往右 */
            const limit = Math.abs(zeroThrow(endX - startX, intervalLimit));
            this.bindInterval(function () {
                if (x >= endX) {
                    return this.restoreInterval();
                }
                x = parseFloat(x + limit);
                this.render(x, startY + zeroThrow(((x - startX) * ((height - padding) - startY)), ((width - padding) - startX)));
            }.bind(this));
        } else {
            /* 往下 */
            const limit = Math.abs(zeroThrow(endY - startY, intervalLimit));
            this.bindInterval(function () {
                if (y >= endY) {
                    return this.restoreInterval();
                }
                y = parseFloat(y + limit);
                this.render(startX + zeroThrow(((y - startY) * ((width - padding) - startX)), ((height - padding) - startY)), y);
            }.bind(this));
        }
    }

    /**
     * 渲染
     * @param pointX
     * @param pointY
     */
    render(pointX:number, pointY:number):void {
        const {width, height, padding} = this.masterStage;

        /* 碰到邊界 */
        pointX = Math.min(pointX, width - padding - 1);
        pointY = Math.min(pointY, height - padding - 1);

        const {sizeLeft, sizeRight} = sizeBetweenPoints(pointX, (width - padding), pointY, (height - padding));
        const unSlope = unSlopeBetweenPoints((width - padding), pointX, (height - padding), pointY);
        /**
         * 取對稱點，再次過濾重複參數
         * @method this.getMirrorPosition
         */
        const getMirrorPosition = function (x, y) {
            return this.getVerticalLineAndMirrorPosition(unSlope, pointX, pointY, x, y)
        }.bind(this);

        /**
         * 取兩線相交的點，再次過濾重複參數
         * @method this.getIntersectPosition
         */
        const getIntersectPosition = function (a, b, c) {
            return this.getMiddleBetweenAndIntersectPosition(unSlope, pointX, pointY, a, b, c);
        }.bind(this);

        /*
         * 生成路徑
         */
        const cardPositionData = {};
        const positionData = {};
        if (sizeRight > (height - (2 * padding))) {
            const {mirrorX, mirrorY} = getMirrorPosition((width - padding), padding);
            /*
             * 生成右四邊形路徑
             */
            /* 移動區元件 */
            positionData[TOP_LEFT] = [mirrorX, mirrorY];
            positionData[TOP_RIGHT] = getIntersectPosition(0, 1, padding);
            positionData[BOTTOM_RIGHT] = getIntersectPosition(0, 1, (height - padding));
            positionData[BOTTOM_LEFT] = [pointX, pointY];
            positionData[ANOTHER_POS] = [];
            /* 卡片元件 */
            cardPositionData[TOP_LEFT] = [0, 0];
            cardPositionData[TOP_RIGHT] = getIntersectPosition(0, 1, padding);
            cardPositionData[BOTTOM_RIGHT] = getIntersectPosition(0, 1, (height - padding));
            cardPositionData[BOTTOM_LEFT] = [0, (height - padding)];
            cardPositionData[ANOTHER_POS] = [];
        }
        else if (sizeLeft > (width - (2 * padding))) {
            const {mirrorX, mirrorY} = getMirrorPosition(0, (height - padding));
            /*
             * 生成下四邊形路徑
             */

            /* 移動區元件 */
            positionData[TOP_LEFT] = getIntersectPosition(1, 0, (width - padding));
            positionData[TOP_RIGHT] = getIntersectPosition(1, 0, padding);
            positionData[BOTTOM_RIGHT] = [mirrorX, mirrorY];
            positionData[BOTTOM_LEFT] = [pointX, pointY];
            positionData[ANOTHER_POS] = [];

            /* 卡片元件 */
            cardPositionData[TOP_LEFT] = [0, 0];
            cardPositionData[TOP_RIGHT] = [(width - padding), 0];
            cardPositionData[BOTTOM_RIGHT] = getIntersectPosition(1, 0, (height - padding));
            cardPositionData[BOTTOM_LEFT] = getIntersectPosition(1, 0, padding);
            cardPositionData[ANOTHER_POS] = [];
        } else {
            /*
             * 生成三角形路徑
             */
            /* 移動區元件 */
            positionData[TOP_LEFT] = getIntersectPosition(1, 0, (width - padding));
            positionData[TOP_RIGHT] = [];
            positionData[BOTTOM_RIGHT] = getIntersectPosition(0, 1, (height - padding));
            positionData[BOTTOM_LEFT] = [pointX, pointY];
            positionData[ANOTHER_POS] = [];

            /* 卡片元件 */
            cardPositionData[TOP_LEFT] = [0, 0];
            cardPositionData[TOP_RIGHT] = [(width - padding), 0];
            cardPositionData[BOTTOM_RIGHT] = getIntersectPosition(0, 1, (height - padding));
            cardPositionData[BOTTOM_LEFT] = [0, (height - padding)];
            cardPositionData[ANOTHER_POS] = getIntersectPosition(1, 0, (width - padding));
        }
        /* 呼叫繪製 */
        this.card.update(cardPositionData[TOP_LEFT], cardPositionData[TOP_RIGHT], cardPositionData[BOTTOM_RIGHT], cardPositionData[BOTTOM_LEFT], cardPositionData[ANOTHER_POS]);
        this.motion.update(positionData[TOP_LEFT], positionData[TOP_RIGHT], positionData[BOTTOM_RIGHT], positionData[BOTTOM_LEFT], positionData[ANOTHER_POS]);
    }
}
