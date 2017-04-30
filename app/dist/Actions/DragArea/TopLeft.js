/**
 * Created by arShown on 2016/3/11.
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

export default class TopLeft extends Base {
    originPosition:Array<number>;
    card:Card;

    constructor(masterStage:Object, card:Card, motion:Motion) {
        super(masterStage, card, motion);
        this.card = card;

        /* 基準點：左上 */
        const {originPosition:{POS_TOP_LEFT}} = card;
        this.originPosition = POS_TOP_LEFT;
    }

    /**
     * 觸發區塊
     * @returns {*}
     */
    getTriggerArea():Object {
        const {element:{width, height}} = this.masterStage;
        const [originX, originY] = this.originPosition;
        const areaSizeWidth = parseInt(width / 4),
            areaSizeHeight = parseInt(height / 6);
        return super.getTriggerArea(areaSizeWidth, areaSizeHeight, originX + (areaSizeWidth / 2), originY + (areaSizeHeight / 2));
    }

    /**
     * 檢查是不是符合開牌範圍
     */
    isTimeToOpen(pointer:Object):boolean {
        const {element:{width, height}} = this.masterStage;
        return pointer.x >= (this.originPosition + width / 3 * 2) || pointer.y >= (this.originPosition + height / 3 * 2);
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
        const pointY = Math.max(pointer.y, originY);
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
        const {originPosition:{POS_BOTTOM_RIGHT}} = this.card;
        /*
         * 觸發時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        x = Math.max(x, originX);
        y = Math.max(y, originY);

        /* parent */
        super.openMotion({x, y});

        const [startX, startY] = [x, y],
            sizeX = Math.abs(originX - startX),
            sizeY = Math.abs(originY - startY);

        /* 判斷展開方向 */
        if (sizeX >= sizeY) {
            /* 往右 */
            const endX = POS_BOTTOM_RIGHT[0],
                limit = Math.abs(zeroThrow(endX - startX, this.intervalLimit));
            this.bindInterval(() => {
                if (x >= endX) {
                    return this.finishInterval();
                }
                x = parseFloat(x + limit);
                this.render(x, Math.max(originY, startY - zeroThrow(((x - startX) * (originY - startY)), (startX - endX))));
            });
        } else {
            /* 往下 */
            const endY = POS_BOTTOM_RIGHT[1],
                limit = Math.abs(zeroThrow(endY - startY, this.intervalLimit));
            this.bindInterval(() => {
                if (y >= endY) {
                    return this.finishInterval();
                }
                y = parseFloat(y + limit);
                this.render(Math.max(originX, startX - zeroThrow(((y - startY) * (originX - startX)), (startY - endY))), y);
            });
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
        y = Math.max(y, originY);

        /* parent */
        super.resetMotion({x, y});

        const [startX, startY] = [x, y],
            sizeX = Math.abs(originX - startX),
            sizeY = Math.abs(originY - startY),
            endX = originX,
            endY = originY;

        //重置
        if (sizeX >= sizeY) {
            /* 往左 */
            const limit = Math.abs(zeroThrow(sizeX, this.intervalLimit));
            this.bindInterval(() => {
                if (x <= endX) {
                    return this.restoreInterval();
                }
                x = parseFloat(x - limit);
                this.render(x, startY + zeroThrow(((x - startX) * (originY - startY)), (originX - startX)));
            });
        } else {
            /* 往上 */
            const limit = Math.abs(zeroThrow(sizeY, this.intervalLimit));
            this.bindInterval(() => {
                if (y <= endY) {
                    return this.restoreInterval();
                }
                y = parseFloat(y - limit);
                this.render(startX + zeroThrow(((y - startY) * (originX - startX)), (originY - startY)), y);
            });
        }
    }

    /**
     * 渲染
     * @param pointX
     * @param pointY
     */
    render(pointX:number, pointY:number):void {
        this.motion.direction = this.card.direction = TOP_LEFT;
        const [originX, originY] = this.originPosition;
        const {element:{width, height}} = this.masterStage;
        const {originPosition:{POS_BOTTOM_RIGHT}} = this.card;

        /* 碰到邊界 */
        pointX = Math.max(pointX, originX + 1);
        pointY = Math.max(pointY, originY + 1);

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
        if (sizeRight > height) {
            const {mirrorX, mirrorY} = mirrorPosition(originX, POS_BOTTOM_RIGHT[1]);
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
            positionData[TOP_LEFT] = getIntersectPosition(0, 1, originY);
            positionData[TOP_RIGHT] = [pointX, pointY];
            positionData[BOTTOM_RIGHT] = [mirrorX, mirrorY];
            positionData[BOTTOM_LEFT] = getIntersectPosition(0, 1, POS_BOTTOM_RIGHT[1]);
            positionData[ANOTHER_POS] = [];
            /* 卡片元件 */
            cardPositionData[TOP_LEFT] = getIntersectPosition(0, 1, originY);
            cardPositionData[BOTTOM_LEFT] = getIntersectPosition(0, 1, POS_BOTTOM_RIGHT[1]);
            cardPositionData[BOTTOM_RIGHT] = POS_BOTTOM_RIGHT;
            cardPositionData[ANOTHER_POS] = [];
            cardPositionData[TOP_RIGHT] = [POS_BOTTOM_RIGHT[0], originY];
        }
        else if (sizeLeft > width) {
            const {mirrorX, mirrorY} = mirrorPosition(POS_BOTTOM_RIGHT[0], originY);
            /*
             * 生成上四邊形路徑
             * A - - - - - - - - - B
             * |                   |
             * C - - - - - - - - - D
             * |                   |
             * |                   |
             * E - - - - - - - - - F
             *
             * positionData
             * --
             * TOP_LEFT     = D
             * TOP_RIGHT    = C
             * BOTTOM_RIGHT = A
             * BOTTOM_LEFT  = B
             *
             * cardPositionData
             * --
             * TOP_LEFT     = A
             * BOTTOM_LEFT  = E
             * BOTTOM_RIGHT = F
             * TOP_RIGHT    = B
             */

            /* 移動區元件 */
            positionData[TOP_LEFT] = [mirrorX, mirrorY];
            positionData[TOP_RIGHT] = [pointX, pointY];
            positionData[BOTTOM_RIGHT] = getIntersectPosition(1, 0, originX);
            positionData[BOTTOM_LEFT] = getIntersectPosition(1, 0, POS_BOTTOM_RIGHT[0]);
            positionData[ANOTHER_POS] = [];

            /* 卡片元件 */
            cardPositionData[TOP_LEFT] = getIntersectPosition(1, 0, originX);
            cardPositionData[BOTTOM_LEFT] = [originX, POS_BOTTOM_RIGHT[1]];
            cardPositionData[BOTTOM_RIGHT] = [POS_BOTTOM_RIGHT[0], POS_BOTTOM_RIGHT[1]];
            cardPositionData[ANOTHER_POS] = [];
            cardPositionData[TOP_RIGHT] = getIntersectPosition(1, 0, POS_BOTTOM_RIGHT[0]);
        } else {
            /*
             * 生成三角形路徑
             *       A - - - - - - B
             *     / |             |
             *   /   |             |
             * C - - D             |
             * |                   |
             * |                   |
             * |                   |
             * E - - - - - - - - - F
             *
             * positionData
             * --
             * TOP_LEFT     = A
             * TOP_RIGHT    = D
             * BOTTOM_RIGHT = C
             *
             * cardPositionData
             * --
             * TOP_LEFT     = C
             * BOTTOM_LEFT  = E
             * BOTTOM_RIGHT = F
             * ANOTHER_POS  = B
             * TOP_RIGHT    = A
             */
            /* 移動區元件 */
            positionData[TOP_LEFT] = getIntersectPosition(0, 1, originY);
            positionData[TOP_RIGHT] = [pointX, pointY];
            positionData[BOTTOM_RIGHT] = getIntersectPosition(1, 0, originX);
            positionData[BOTTOM_LEFT] = [];
            positionData[ANOTHER_POS] = [];
            /* 卡片元件 */
            cardPositionData[TOP_LEFT] = getIntersectPosition(1, 0, originX);
            cardPositionData[BOTTOM_LEFT] = [originX, POS_BOTTOM_RIGHT[1]];
            cardPositionData[BOTTOM_RIGHT] = [POS_BOTTOM_RIGHT[0], POS_BOTTOM_RIGHT[1]];
            cardPositionData[ANOTHER_POS] = [POS_BOTTOM_RIGHT[0], originY];
            cardPositionData[TOP_RIGHT] = getIntersectPosition(0, 1, originY);
        }
        /* 呼叫繪製 */
        this.card.update(cardPositionData[TOP_LEFT], cardPositionData[TOP_RIGHT], cardPositionData[BOTTOM_RIGHT], cardPositionData[BOTTOM_LEFT], cardPositionData[ANOTHER_POS]);
        this.motion.update(positionData[TOP_LEFT], positionData[TOP_RIGHT], positionData[BOTTOM_RIGHT], positionData[BOTTOM_LEFT], positionData[ANOTHER_POS]);
    }
}
