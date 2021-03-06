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
    /* 方向 */
    direction:"v" | "h"; //vertical | horizontal
    /* 渲染模式 */
    renderer:number;
    /* stage */
    phaserGame:Object;
    /* status */
    status:"pending" | "moving" | "finish";
    /* 啟用 */
    enabled:boolean;
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
        this.direction = "v";
        this.status = "pending";
        this.enabled = true;
        this.width = this.height = this.padding = 0;
        this.dragPendingCallback = this.dragFinishCallback = () => {
        };
        this.dragStartCallback = this.dragStopCallback = (x:number, y:number) => {
        };
        /* 移除 phaser console */
        window.PhaserGlobal = {
            hideBanner: true
        };
    }

    _getElementParamsByDirection(direction:"v"|"h"):Object {
        const gameSize = Math.max(this.width, this.height) + 2 * this.padding;
        if (direction === "v") {
            return {
                padding: this.padding,
                width: this.width,
                height: this.height,
                masterSize: gameSize
            };
        } else {
            return {
                padding: this.padding,
                width: this.height,
                height: this.width,
                masterSize: gameSize
            };
        }
    }

    start():void {
        /* 建構主stage */
        const gameSize = Math.max(this.width, this.height) + 2 * this.padding;
        if (this.direction === "v")
            this.phaserGame = new Phaser.Game(gameSize, gameSize, this.renderer, this.parentElementId, null, true);
        else
            this.phaserGame = new Phaser.Game(gameSize, gameSize, this.renderer, this.parentElementId, null, true);
        this.phaserGame.element = this._getElementParamsByDirection(this.direction);
        this.phaserGame.direction = this.direction;
        this.phaserGame.cardCode = this.cardCode;
        this.phaserGame.assertUrl = this.assertUrl;
        this.phaserGame.enabled = this.enabled;
        this.phaserGame.dragPendingCallback = () => {
            this.status = "pending";
            this.dragPendingCallback();
        };
        this.phaserGame.dragStartCallback = (x:number, y:number) => {
            this.status = "moving";
            this.dragStartCallback(x, y);
        }
        this.phaserGame.dragStopCallback = (x:number, y:number) => {
            this.dragStopCallback(x, y);
        }
        this.phaserGame.dragFinishCallback = () => {
            this.status = "finish";
            this.dragFinishCallback();
        }
        /* 執行主場景 */
        this.phaserGame.state.add("mainStage", new MainStage(this.phaserGame));
        this.phaserGame.state.start("mainStage", true, true, this.status === "finish" ? "opened" : "default", {
            direction: this.direction,
            element: this._getElementParamsByDirection(this.direction)
        });
    }

    /**
     * 轉向
     */
    turn():void {
        if (this.phaserGame.enabled && this.status === "pending") {
            this.status = "moving";
            const netDirection = this.direction === "v" ? "h" : "v"
            this.phaserGame.state.start("mainStage", false, false, "turn", {
                direction: this.direction,
                element: this._getElementParamsByDirection(this.direction),
                tweenCallback: () => {
                    this.phaserGame.state.start("mainStage", false, false, "default", {
                        direction: netDirection,
                        element: this._getElementParamsByDirection(netDirection)
                    });
                }
            });
            this.direction = netDirection;
        }
    }

    restart():void {
        this.status = "pending";
        this.phaserGame.direction = this.direction;
        this.phaserGame.cardCode = this.cardCode;
        this.phaserGame.enabled = this.enabled;
        this.phaserGame.state.start("mainStage", false, false, "default");
    }

    finish():void {
        this.phaserGame.state.start("mainStage", false, false, "opened", {
            direction: this.direction,
            element: this._getElementParamsByDirection(this.direction)
        });
    }

    destroy():void {
        this.phaserGame.destroy();
    }
}
