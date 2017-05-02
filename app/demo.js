/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/14
 */
import Poker from "./main";


function randomCard() {
    const type = ["H", "S", "D", "C"];
    return type[parseInt(Math.random() * 4)] + parseInt(Math.random() * 13 + 1);
}

var debug = true;
window.onload = function () {
    /* Start */
    var game = new Poker();
    /**
     * @type {string | HTMLElement}
     * The DOM element into which this games canvas will be injected.
     * Either a DOM ID (string) or the element itself.
     */
    game.cardCode = randomCard();
    game.parentElementId = "container";
    game.width = 360;
    game.height = 485;
    game.direction = "v";
    game.assertUrl = "assets/images"
    game.padding = 80;
    //game.status = "finish";
    //game.enabled = false;
    game.backgroundColor = "#000000";
    const openEle = document.getElementById("open");
    openEle && openEle.addEventListener('click', game.finish.bind(game));

    const turnEle = document.getElementById("turn");
    turnEle && turnEle.addEventListener('click', () => {
        game.turn();
    });

    const resetEle = document.getElementById("reset");
    resetEle && resetEle.addEventListener('click', () => {
        game.destroy();
        game.cardCode = randomCard();
        game.status = "pending";
        game.start();
    });

    const msgEle:any = document.getElementById("msg");
    let from = "", to = "", status = "";
    const setMeg = () => {
        msgEle && (msgEle.innerHTML = `狀態：${status} ${from ? ', from : ' + from : ''} ${to ? '; to : ' + to : ''}`);
    }
    game.dragPendingCallback = () => {
        status = "Pending";
        from = to = '';
        setMeg();
    };
    game.dragStartCallback = (x:number, y:number) => {
        status = "Start";
        from = `${parseInt(x)},${parseInt(y)}`;
        setMeg();
    };
    game.dragStopCallback = (x:number, y:number) => {
        status = "Stop";
        to = `${parseInt(x)},${parseInt(y)}`;
        setMeg();
    };
    game.dragFinishCallback = () => {
        status = "Finish";
        setMeg();
    };
    /* 開始 */
    game.start();
};
