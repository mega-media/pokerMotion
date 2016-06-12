/**
 * Created by arShown on 2016/6/7.
 */
"use strict";
import Poker from './dist/Poker';

var debug = true;
window.onload = function () {
  if(debug)
  {
    sessionStorage.clear();
  }
	/* Start */
  var game = new Poker();
  /**
   * @type {string | HTMLElement}
   * The DOM element into which this games canvas will be injected.
   * Either a DOM ID (string) or the element itself.
   */
  game.cardImg = "poker1.png";
  game.parent = "container";
  game.start();
  //var game2 = new Poker();
  //game2.start();
};
