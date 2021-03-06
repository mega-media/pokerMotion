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
        leftX:number,
        originX:number,
        topY:number,
        bottomY:number
    };

    constructor(masterStage:Object, card:Card, motion:Motion) {
        super(masterStage, card, motion);

        /* 基準點: 右 */
        const {originPosition:{POS_TOP_LEFT, POS_TOP_RIGHT, POS_BOTTOM_RIGHT}} = card;
        this.originPosition = {
            leftX: POS_TOP_LEFT[0],
            originX: POS_TOP_RIGHT[0],
            topY: POS_TOP_RIGHT[1],
            bottomY: POS_BOTTOM_RIGHT[1]
        };
    }

    /**
     * 觸發區塊
     * @returns {*}
     */
    getTriggerArea():Object {
        const {element:{width, height}} = this.masterStage;
        const {originX, topY} = this.originPosition;

        const areaSizeHeightBlock = parseInt(height / 6),
            areaSizeWidth = parseInt(width / 4),
            areaSizeHeight = height - 2 * areaSizeHeightBlock;
        return super.getTriggerArea(areaSizeWidth, areaSizeHeight, originX - (areaSizeWidth / 2), topY + (areaSizeHeight / 2) + areaSizeHeightBlock);
    }

    /**
     * 檢查是不是符合開牌範圍
     */
    isTimeToOpen(pointer:Object):boolean {
        const {element:{width}} = this.masterStage;
        return pointer.x <= (this.originPosition.leftX + (width / 3));
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

        const {originX, leftX} = this.originPosition;
        /*
         * 觸發時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        x = Math.min(x, originX);

        /* parent */
        super.openMotion({x, y});

        const limit = Math.abs(zeroThrow(leftX - x, this.intervalLimit));
        this.bindInterval(() => {
            x = parseFloat(x - limit);
            this.render(x);
            if (x <= leftX)
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

        const {originX} = this.originPosition;
        /*
         * 放開時的座標
         */
        let {x, y} = pointer;
        /* 碰到邊界 */
        x = Math.min(x, originX);

        /* parent */
        super.resetMotion({x, y});

        const limit = Math.abs(zeroThrow(originX - x, this.intervalLimit));
        this.bindInterval(() => {
            x = parseFloat(x + limit);
            this.render(x);
            if (x >= originX)
                this.restoreInterval();
        });

    }

    /**
     * 渲染
     * @param pointX
     * @param pointY
     */
    render(pointX:number):void {
        this.motion.direction = this.card.direction = RIGHT;
        const {originX, topY, bottomY, leftX} = this.originPosition;
        /* 碰到邊界 */
        pointX = Math.min(pointX, originX - 1);

        /*
         * 生成路徑
         * A - - - - B - - C
         * |         |     |
         * |         |     |
         * |         |     |
         * |         |     |
         * |         |     |
         * |         |     |
         * D - - - - E - - F
         *
         * positionData
         * --
         * TOP_LEFT     = B
         * TOP_RIGHT    = C
         * BOTTOM_RIGHT = F
         * BOTTOM_LEFT  = E
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
        positionData[TOP_LEFT] = [pointX, topY];
        positionData[TOP_RIGHT] = [(originX + pointX) / 2, topY];
        positionData[BOTTOM_RIGHT] = [(originX + pointX) / 2, bottomY];
        positionData[BOTTOM_LEFT] = [pointX, bottomY];
        positionData[ANOTHER_POS] = [];
        /* 卡片元件 */
        cardPositionData[TOP_LEFT] = [leftX, topY];
        cardPositionData[BOTTOM_LEFT] = [leftX, bottomY];
        cardPositionData[BOTTOM_RIGHT] = [(originX + pointX) / 2, bottomY];
        cardPositionData[ANOTHER_POS] = [];
        cardPositionData[TOP_RIGHT] = [(originX + pointX) / 2, topY];

        /* 呼叫繪製 */
        this.card.update(cardPositionData[TOP_LEFT], cardPositionData[TOP_RIGHT], cardPositionData[BOTTOM_RIGHT], cardPositionData[BOTTOM_LEFT], cardPositionData[ANOTHER_POS]);
        this.motion.update(positionData[TOP_LEFT], positionData[TOP_RIGHT], positionData[BOTTOM_RIGHT], positionData[BOTTOM_LEFT], positionData[ANOTHER_POS]);
    }
}
