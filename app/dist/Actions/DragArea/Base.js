/**
 * Created by arShown on 2016/6/8.
 * Updated on 2017/3/8.
 */
import Card         from '../../Components/Card';
import Motion       from '../../Components/Motion';
import {
    middleBetweenPoints,
    getIntersectPosition,
    theVerticalLineFuc,
    getMirrorPosition
} from '../../Helpers/Points';

export default class Base {
    masterStage:Object;
    card:Card;
    motion:Motion;
    interval:?number;
    motionFlag:boolean;

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
        this.masterStage.dragFinishCallback("opened", pointer.x, pointer.y);
    }

    /**
     * 放開時回原狀
     * @returns {null}
     */
    resetMotion(pointer:Object):?void {
        this.masterStage.dragFinishCallback("waiting", pointer.x, pointer.y);
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
    }

    /**
     * 操作結束，開牌
     */
    finishInterval():void {
        if (this.interval)
            clearInterval(this.interval);

        this.card.remove();
        this.motion.finish();
        this.motionFlag = false;
    }


    /**
     * 取得對稱點，過濾重複使用的參數
     * @param unSlope 斜率
     * @param pointX 滑鼠座標
     * @param pointY 滑鼠座標
     * @param x
     * @param y
     * @returns {mirrorX: number, mirrorY: number}
     */
    getVerticalLineAndMirrorPosition(unSlope:number, pointX:number, pointY:number, x:number, y:number):{mirrorX: number, mirrorY: number} {
        const {width, height, padding} = this.masterStage;
        var LineFuc = theVerticalLineFuc(width - padding, pointX, height - padding, pointY);
        return getMirrorPosition(x, y, unSlope, LineFuc);
    }

    /**
     * 兩線相交的點，過濾重複使用的參數
     * @param unSlope 斜率
     * @param pointX 滑鼠座標
     * @param pointY 滑鼠座標
     * @param a
     * @param b
     * @param c
     * @returns {point[x,y]}
     */
    getMiddleBetweenAndIntersectPosition(unSlope:number, pointX:number, pointY:number, a:number, b:number, c:number):Array<number> {
        const {width, height, padding} = this.masterStage;
        var middlePoint = middleBetweenPoints(width - padding, pointX, height - padding, pointY);
        return getIntersectPosition(unSlope, -1, unSlope * middlePoint.x - middlePoint.y, a, b, c);
    }
}
