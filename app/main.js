/**
 * Created by arShown on 2016/6/7.
 */
"use strict";
import Poker from './dist/Poker';

window.onload = function () {
	/* Start */
  var game = new Poker();
  /**
   * @type {string | HTMLElement}
   * The DOM element into which this games canvas will be injected.
   * Either a DOM ID (string) or the element itself.
   */
  game.parent = "container";
  game.start();
};
