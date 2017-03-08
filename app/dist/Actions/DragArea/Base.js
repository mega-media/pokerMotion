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
    areaSize:number;
    intervalLimit:number;
    interval:?number;
    motionFlag:boolean;

    constructor(masterStage:Object, card:Card, motion:Motion) {
        this.masterStage = masterStage;
        this.card = card;
        this.motion = motion;
        this.areaSize = 100;
        this.intervalLimit = 200;
        this.interval = null;
        this.motionFlag = true;
    }

    getMovePermission():boolean {
        return this.motionFlag;
    }

    setMovePermission(flag:boolean):void {
        this.motionFlag = flag;
    }

    bindInterval(handler:() => any):void {
        this.interval = setInterval(handler, 1);
    }

    finishInterval():void {
        if (this.interval)
            clearInterval(this.interval);

        this.card.restore();
        //this.motion.restore();
        this.setMovePermission(true);
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
