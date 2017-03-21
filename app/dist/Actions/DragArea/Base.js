/**
 * Created by arShown on 2016/6/8.
 * Updated on 2017/3/8.
 */
import Card         from '../../Components/Card';
import Motion       from '../../Components/Motion';
import {
    middleBetweenPoints,
    getIntersectPosition,
    getMirrorPosition
} from '../../Helpers/Points';

export default class Base {
    masterStage:Object;
    card:Card;
    motion:Motion;
    interval:?number;
    motionFlag:boolean;
    finishCallback:any;
    
    constructor(masterStage:Object, card:Card, motion:Motion) {
        this.masterStage = masterStage;
        this.card = card;
        this.motion = motion;
        this.interval = null;
        this.motionFlag = true;
    }

    /**
     * 檢查是不是符合開牌範圍
     */
    isTimeToOpen(pointer:Object):boolean {
        return false;
    }

    /**
     * 拖曳動作
     * @param pointer
     * @returns {null}
     */
    dragMotion(pointer:Object):?void {
        return null;
    }

    /**
     * 自動開牌
     */
    openMotion(pointer:Object):?void {
        this.masterStage.dragStopCallback(pointer.x, pointer.y);
    }

    /**
     * 放開時回原狀
     * @returns {null}
     */
    resetMotion(pointer:Object):?void {
        this.masterStage.dragStopCallback(pointer.x, pointer.y);
    }

    /**
     * 渲染
     * @param pointX
     * @param pointY
     */
    render(pointX:number, pointY:number):void {
    }

    /**
     * 綁定interval
     * @param handler
     */
    bindInterval(handler:() => any):void {
        this.interval = setInterval(handler, 1);
    }

    /**
     * 觸發區塊
     * @returns {*}
     */
    getTriggerArea(bmdW:number, bmdH:number, bmdX:number, bmdY:number):Object {
        const bmd = this.masterStage.add.bitmapData(bmdW, bmdH);
        const sprite = this.masterStage.add.sprite(bmdX, bmdY, bmd);
        sprite.dragMotion = this.dragMotion.bind(this);
        sprite.resetMotion = this.resetMotion.bind(this);
        return sprite;
    }

    /**
     * 操作結束，初始化元件
     */
    restoreInterval():void {
        if (this.interval)
            clearInterval(this.interval);

        this.card.restore();
        this.motion.restore();
        this.motionFlag = true;
        /* callback */
        this.masterStage.dragPendingCallback();
    }

    /**
     * 操作結束，開牌
     */
    finishInterval():void {
        if (this.interval)
            clearInterval(this.interval);
        
        /* callback */
        this.finishCallback.call(this);
    }
    
    /**
     * 兩線相交的點，過濾重複使用的參數
     * @param unSlope 斜率
     * @param middlePointX 中點座標.x
     * @param middlePointY 中點座標.y
     * @param a
     * @param b
     * @param c
     * @returns {Array.<number>}
     */
    getMiddleBetweenAndIntersectPosition(unSlope:number, middlePointX:number, middlePointY:number, a:number, b:number, c:number):Array<number> {
        return getIntersectPosition(unSlope, -1, unSlope * middlePointX - middlePointY, a, b, c);
    }
}
