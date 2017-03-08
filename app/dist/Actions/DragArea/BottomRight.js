/**
 * Created by arShown on 2016/6/8.
 * Updated on 2017/3/8.
 */
import Base                                                             from './Base';
import {TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT, BOTTOM_LEFT, ANOTHER_POS}    from '../../Constants/Constants';
import Card                                                             from '../../Components/Card';
import Motion                                                           from '../../Components/Motion';
import {sizeBetweenPoints, unSlopeBetweenPoints, zeroThrow}             from '../../Helpers/Points';

export default class BottomRight extends Base {
    constructor(masterStage:Object, card:Card, motion:Motion) {
        super(masterStage, card, motion);
        this.motion.direction = this.card.direction = BOTTOM_RIGHT;
    }

    getTriggerArea():Object {
        const {width, height, padding} = this.masterStage;
        const bmd = this.masterStage.add.bitmapData(this.areaSize, this.areaSize);
        const sprite = this.masterStage.add.sprite(
            (width - padding) - (this.areaSize / 2),
            (height - padding) - (this.areaSize / 2),
            bmd);
        sprite.dragMotion = this.dragMotion.bind(this);
        sprite.resetMotion = this.resetMotion.bind(this);
        return sprite;
    }

    dragMotion(pointer:Object):?void {
        if (!this.getMovePermission()) {
            return null;
        }
        const {width, height, padding} = this.masterStage;
        const pointY = Math.min(pointer.y, (height - padding) - 1);
        const pointX = Math.min(pointer.x, (width - padding) - 1);
        this.renderComponent(pointX, pointY);
    }

    resetMotion():?void {
        if (!this.getMovePermission()) {
            return null;
        }
        const motionStore = this.masterStage.store.get("motion");
        if (!motionStore) {
            return null;
        }
        this.setMovePermission(false);

        /*
         * 放開時的座標
         */
        const pointer = motionStore.positions[BOTTOM_LEFT];
        let [x,y] = pointer.slice(0);
        const [startX,startY] = pointer.slice(0);
        const {width, height, padding} = this.masterStage;
        const sizeX = (width - padding) - startX;
        const sizeY = (height - padding) - startY;

        //重置
        if (sizeX >= sizeY) {
            this.bindInterval(function () {
                const limit = zeroThrow(sizeX, this.intervalLimit);
                if (x >= (width - padding) - limit) {
                    return this.finishInterval();
                }
                x = parseFloat(x + limit);
                this.renderComponent(x, startY + zeroThrow(((x - startX) * ((height - padding) - startY)), ((width - padding) - startX)));
            }.bind(this));
        } else {
            this.bindInterval(function () {
                const limit = zeroThrow(sizeY, this.intervalLimit);
                if (y >= (height - padding) - limit) {
                    return this.finishInterval();
                }
                y = parseFloat(y + limit);
                this.renderComponent(startX + zeroThrow(((y - startY) * ((width - padding) - startX)), ((height - padding) - startY)), y);
            }.bind(this));
        }
    }

    renderComponent(pointX:number, pointY:number):void {
        const {width, height, padding} = this.masterStage;
        const originCardPositions = this.masterStage.store.get("card").positions;
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
            cardPositionData[TOP_LEFT] = originCardPositions[TOP_LEFT];
            cardPositionData[TOP_RIGHT] = getIntersectPosition(0, 1, padding);
            cardPositionData[BOTTOM_RIGHT] = getIntersectPosition(0, 1, (height - padding));
            cardPositionData[BOTTOM_LEFT] = originCardPositions[BOTTOM_LEFT];
            cardPositionData[ANOTHER_POS] = [];
        }
        else if (sizeLeft > (width - (2 * padding))) {
            const {mirrorX, mirrorY} = getMirrorPosition(0, (height - padding));
            /*
             * 生成下四邊形路徑
             */

            /* 移動區元件 */
            //positionData[TOP_LEFT] = getIntersectPosition(1, 0, (this.masterStage.width-100));
            positionData[TOP_LEFT] = getIntersectPosition(1, 0, (width - padding));
            positionData[TOP_RIGHT] = getIntersectPosition(1, 0, padding);
            positionData[BOTTOM_RIGHT] = [mirrorX, mirrorY];
            positionData[BOTTOM_LEFT] = [pointX, pointY];
            positionData[ANOTHER_POS] = [];

            /* 卡片元件 */
            cardPositionData[TOP_LEFT] = originCardPositions[TOP_LEFT];
            cardPositionData[TOP_RIGHT] = originCardPositions[TOP_RIGHT];
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
            cardPositionData[TOP_LEFT] = originCardPositions[TOP_LEFT];
            cardPositionData[TOP_RIGHT] = originCardPositions[TOP_RIGHT];
            cardPositionData[BOTTOM_RIGHT] = getIntersectPosition(0, 1, (height - padding));
            cardPositionData[BOTTOM_LEFT] = originCardPositions[BOTTOM_LEFT];
            cardPositionData[ANOTHER_POS] = getIntersectPosition(1, 0, (width - padding));
        }
        /* 呼叫繪製 */
        this.card.update(cardPositionData[TOP_LEFT], cardPositionData[TOP_RIGHT], cardPositionData[BOTTOM_RIGHT], cardPositionData[BOTTOM_LEFT], cardPositionData[ANOTHER_POS]);
        this.motion.update(positionData[TOP_LEFT], positionData[TOP_RIGHT], positionData[BOTTOM_RIGHT], positionData[BOTTOM_LEFT], positionData[ANOTHER_POS]);
    }
}
