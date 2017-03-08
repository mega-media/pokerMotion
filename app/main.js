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
    game.cardImgFileName = "poker1.png";
    game.parentElementId = "container";
    game.width = 640;
    game.height = 800;
    game.start();
    /*
    var game2 = new Poker();
    game2.cardImgFileName = "poker2.png";
    game2.parentElementId = "container2";
    game2.width = 640;
    game2.height = 800;
    game2.start();*/
};
