/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/8
 */
import 'babel-polyfill';
import 'es6-promise';
import 'pixi.js';
import 'p2';
import 'phaser';
import Poker from './dist/Poker';

var debug = true;
window.onload = function () {
    /* Start */
    var game = new Poker();
    /**
     * @type {string | HTMLElement}
     * The DOM element into which this games canvas will be injected.
     * Either a DOM ID (string) or the element itself.
     */
    game.cardImgFileName = "poker2.png";
    game.parentElementId = "container";
    game.width = 400;
    game.height = 500;
    game.padding = 50;
    const openEle = document.getElementById("open");
    openEle && openEle.addEventListener('click', game.finish.bind(game));
    const resetEle = document.getElementById("reset");
    resetEle && resetEle.addEventListener('click', () => {
        game.destroy();
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

    /*
     var game2 = new Poker();
     game2.cardImgFileName = "poker2.png";
     game2.parentElementId = "container2";
     game2.width = 640;
     game2.height = 800;
     game2.start();*/
};
