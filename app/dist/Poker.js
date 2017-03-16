/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/8.
 */
import MainStage        from './Stages/MainStage';
import StorageLibrary   from './Libraries/StorageLibrary';

export default class Poker {
    parentElementId:string;
    cardImgFileName:string;
    width:number;
    height:number;
    padding:number;
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
        this.cardImgFileName = "";
        this.width = this.height = this.padding = 0;
        this.dragPendingCallback = this.dragStartCallback = this.dragStopCallback = this.dragFinishCallback = () => {
        };
    }

    start():void {
        console.log("================ Poker start! ================ ");
        /* 建構主stage */
        this.phaserGame = new Phaser.Game(this.width, this.height, this.renderer, this.parentElementId);
        this.phaserGame.padding = this.padding;
        this.phaserGame.dragPendingCallback = this.dragPendingCallback;
        this.phaserGame.dragStartCallback = this.dragStartCallback;
        this.phaserGame.dragStopCallback = this.dragStopCallback;
        this.phaserGame.dragFinishCallback = this.dragFinishCallback;
        /* 場景 */
        this.phaserGame.state.add("loadStage", new MainStage(this.phaserGame, this.cardImgFileName));
        this.phaserGame.state.start("loadStage");
    }

    finish():boolean {
        console.log("================ Poker finish! ================ ");
        if (this.phaserGame && this.phaserGame.finish) {
            this.phaserGame.finish();
        } else {
            console.log("stage 尚未準備就緒");
            return false;
        }
        return true;
    }

    destroy():void {
        this.phaserGame.destroy();
        console.log("================ Poker destroy! ================ ");
    }
}
