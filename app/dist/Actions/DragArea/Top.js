/**
 * Created by arShown on 2016/6/8.
 * Updated on 2017/3/8.
 */
import Base                           from './Base';
import {
    TOP,
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

export default class Top extends Base {
    originPosition:{
        bottomY:number,
        originY:number,
        leftX:number,
        rightX:number
    };

    constructor(masterStage:Object, card:Card, motion:Motion) {
        super(masterStage, card, motion);

        /* 基準點：上 */
        const {originPosition:{POS_TOP_LEFT, POS_TOP_RIGHT, POS_BOTTOM_LEFT}} = card;
        this.originPosition = {
            bottomY: POS_BOTTOM_LEFT[1],
            originY: POS_TOP_RIGHT[1],
            leftX: POS_TOP_LEFT[0],
            rightX: POS_TOP_RIGHT[0]
        };
    }

    /**
     * 觸發區塊
     * @returns {*}
     */
    getTriggerArea():Object {
        const {element:{width, height}} = this.masterStage;
        const {originY, leftX} = this.originPosition;
        const areaSizeWidthBlock = parseInt(width / 4),
            areaSizeWidth = width - 2 * (areaSizeWidthBlock),
            areaSizeHeight = parseInt(height / 6);
        return super.getTriggerArea(areaSizeWidth, areaSizeHeight, leftX + (areaSizeWidth / 2) + areaSizeWidthBlock, originY + (areaSizeHeight / 2));
    }

    /**
     * 檢查是不是符合開牌範圍
     */
    isTimeToOpen(pointer:Object):boolean {
        const {element:{height}} = this.masterStage;
        return pointer.y >= (this.originPosition.bottomY - height / 3);
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
        const pointY = Math.max(pointer.y, originY);
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

        const {bottomY, originY} = this.originPosition;
        /*
         * 觸發時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        y = Math.max(y, originY);

        /* parent */
        super.openMotion({x, y});

        const limit = Math.abs(zeroThrow(bottomY - y, this.intervalLimit));
        this.bindInterval(() => {
            y = parseFloat(y + limit);
            this.render(y);
            if (y >= bottomY)
                this.finishInterval();
        });
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
        const {originY} = this.originPosition;
        /*
         * 放開時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        y = Math.max(y, originY);

        /* parent */
        super.resetMotion({x, y});
        const limit = Math.abs(zeroThrow(y - originY, this.intervalLimit));

        this.bindInterval(() => {
            y = parseFloat(y - limit);
            this.render(y);
            if (y <= originY)
                this.restoreInterval();
        });
    }

    /**
     * 渲染
     * @param pointX
     * @param pointY
     */
    render(pointY:number):void {
        this.motion.direction = this.card.direction = TOP;
        const {bottomY, originY, leftX, rightX} = this.originPosition;
        /* 碰到邊界 */
        pointY = Math.max(pointY, originY + 1);

        /*
         * 生成路徑
         * A - - - - - - - - - B
         * |                   |
         * C - - - - - - - - - D
         * |                   |
         * |                   |
         * E - - - - - - - - - F
         *
         * positionData
         * --
         * TOP_LEFT     = C
         * TOP_RIGHT    = D
         * BOTTOM_RIGHT = B
         * BOTTOM_LEFT  = A
         *
         * cardPositionData
         * --
         * TOP_LEFT     = A
         * BOTTOM_LEFT  = E
         * BOTTOM_RIGHT = F
         * TOP_RIGHT    = B
         */
        const cardPositionData = {};
        const positionData = {};

        /* 移動區元件 */
        positionData[TOP_LEFT] = [leftX, pointY];
        positionData[TOP_RIGHT] = [rightX, pointY];
        positionData[BOTTOM_RIGHT] = [rightX, (originY + pointY) / 2];
        positionData[BOTTOM_LEFT] = [leftX, (originY + pointY) / 2];
        positionData[ANOTHER_POS] = [];

        /* 卡片元件 */
        cardPositionData[TOP_LEFT] = [leftX, (originY + pointY) / 2];
        cardPositionData[BOTTOM_LEFT] = [leftX, bottomY];
        cardPositionData[BOTTOM_RIGHT] = [rightX, bottomY];
        cardPositionData[ANOTHER_POS] = [];
        cardPositionData[TOP_RIGHT] = [rightX, (originY + pointY) / 2];

        /* 呼叫繪製 */
        this.card.update(cardPositionData[TOP_LEFT], cardPositionData[TOP_RIGHT], cardPositionData[BOTTOM_RIGHT], cardPositionData[BOTTOM_LEFT], cardPositionData[ANOTHER_POS]);
        this.motion.update(positionData[TOP_LEFT], positionData[TOP_RIGHT], positionData[BOTTOM_RIGHT], positionData[BOTTOM_LEFT], positionData[ANOTHER_POS]);
    }
}
