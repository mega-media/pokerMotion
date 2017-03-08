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
    renderer:number;
    phaserGame:Object;

    constructor() {
        this.renderer = Phaser.CANVAS;
        this.phaserGame = {};
    }

    start():void {
        console.log("================ Poker start! ================ ");
        /* 建構主stage */
        this.phaserGame = new Phaser.Game(this.width, this.height, this.renderer, this.parentElementId);
        this.phaserGame.store = new StorageLibrary();
        this.phaserGame.padding = 100;
        /* 場景 */
        this.phaserGame.state.add("loadStage", new MainStage(this.phaserGame, this.cardImgFileName));
        this.phaserGame.state.start("loadStage");
    }

    destroy():void {
        this.phaserGame.destroy();
        console.log("================ Poker destory! ================ ");
    }
}
