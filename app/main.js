/**
 * Created by arShown on 2016/6/7.
 * Updated on 2017/3/14
 */
import Poker from './dist/Poker';

/* 檢查 phaser 有沒有載入 */
if (typeof Phaser === "undefined")
    throw "Phaser is not loaded";

module.exports = Poker;