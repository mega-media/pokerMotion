/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/14.
 */
import MainStage        from './Stages/MainStage';

export default class Poker {
    /* html element id */
    parentElementId:string;
    /* 卡牌代號 */
    cardCode:string;
    /* 圖片路徑 */
    assertUrl:string;
    /* 畫面總寬 */
    width:number;
    /* 畫面總高 */
    height:number;
    /* 內距 */
    padding:number;
    /* 背景顏色 */
    backgroundColor:string;
    /* 渲染模式 */
    renderer:number;
    /* stage */
    phaserGame:Object;
    /* status callback */
    dragPendingCallback:() => any;
    dragStartCallback:(x:number, y:number) => any;
    dragStopCallback:(x:number, y:number) => any;
    dragFinishCallback:() => any;

    constructor() {
        this.renderer = Phaser.CANVAS;
        this.phaserGame = {};
        this.parentElementId = "";
        this.cardCode = "";
        this.assertUrl = "";
        this.backgroundColor = "#FFFFFF";
        this.width = this.height = this.padding = 0;
        this.dragPendingCallback = this.dragStartCallback = this.dragStopCallback = this.dragFinishCallback = () => {
        };
        /* 移除 phaser console */
        window.PhaserGlobal = {
            hideBanner: true
        };
    }

    start():void {
        /* 建構主stage */
        this.phaserGame = new Phaser.Game(this.width, this.height, this.renderer, this.parentElementId);
        this.phaserGame.padding = this.padding;
        this.phaserGame.backgroundColor = this.backgroundColor;
        this.phaserGame.cardCode = this.cardCode;
        this.phaserGame.assertUrl = this.assertUrl;
        this.phaserGame.dragPendingCallback = this.dragPendingCallback;
        this.phaserGame.dragStartCallback = this.dragStartCallback;
        this.phaserGame.dragStopCallback = this.dragStopCallback;
        this.phaserGame.dragFinishCallback = this.dragFinishCallback;
        /* 場景 */
        this.phaserGame.state.add("loadStage", new MainStage(this.phaserGame));
        this.phaserGame.state.start("loadStage");
    }

    finish():boolean {
        if (this.phaserGame && this.phaserGame.finish) {
            this.phaserGame.finish();
        } else {
            return false;
        }
        return true;
    }

    destroy():void {
        this.phaserGame.destroy();
    }
}
