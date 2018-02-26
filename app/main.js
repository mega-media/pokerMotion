import {
  PADDING,
  AREA_SIZE,
  ELE_HEIGHT,
  ELE_WIDTH,
  ORIGIN_POINTS,
  APP_WIDTH, APP_HEIGHT
} from './constant';
import { flatten, forEach } from 'ramda';
import {
  setCardParams as topCardParams,
  pointerMove as topSideMove,
  pointerUp as topSideUp,
  pointerOver as topSideOver
} from './toggle/top';
import {
  setCardParams as bottomCardParams,
  pointerMove as bottomSideMove,
  pointerUp as bottomSideUp,
  pointerOver as bottomSideOver
} from './toggle/bottom';
import {
  setCardParams as leftCardParams,
  pointerMove as leftSideMove,
  pointerUp as leftSideUp,
  pointerOver as leftSideOver
} from './toggle/left';
import {
  setCardParams as rightCardParams,
  pointerMove as rightSideMove,
  pointerUp as rightSideUp,
  pointerOver as rightSideOver
} from './toggle/right';
import {
  setCardParams as bottomRightCardParams,
  pointerMove as bottomRightSideMove,
  pointerUp as bottomRightSideUp,
  pointerOver as bottomRightSideOver
} from './toggle/bottom-right';

/* constant */
const IMAGE_PATH = 'src/faces';
const BACK = 'back.png';
const CARD = '0_10.svg';

/* create an application */
const app = new PIXI.Application(
  APP_WIDTH,
  APP_HEIGHT,
  {
    //transparent: true
    backgroundColor: 0x1099bb
  }
);
app.stage.interactive = true;
document.getElementById('container').appendChild(app.view);

/* set Graphics prototype */
PIXI.Graphics.prototype.refresh = function (maskPoints) {
  this.clear();
  this.beginFill(0x000000, 0);
  this.drawPolygon(flatten(maskPoints));
};

/* 遮罩 */
const mask = new PIXI.Graphics();
mask.beginFill(0x0000ff, 0.3);
mask.lineStyle(0);
mask.drawPolygon(flatten(ORIGIN_POINTS));
mask.pivot.x = ELE_WIDTH / 2;
mask.pivot.y = ELE_HEIGHT / 2;

/* 底圖 */
const back = new PIXI.Graphics();
back.beginFill(0xffffff, 1);
back.lineStyle(0);
back.drawRect(APP_WIDTH / 2, APP_HEIGHT / 2, ELE_WIDTH, ELE_HEIGHT);
back.pivot.x = ELE_WIDTH / 2;
back.pivot.y = ELE_HEIGHT / 2;

const backImg = PIXI.Sprite.fromImage(IMAGE_PATH + '/' + BACK);
backImg.x = APP_WIDTH / 2 - 15;
backImg.y = APP_HEIGHT / 2 - 15;
backImg.width = ELE_WIDTH + 30;
backImg.height = ELE_HEIGHT + 30;
back.addChild(backImg);

/* 卡牌 */
const card = new PIXI.Sprite(PIXI.Texture.WHITE);
card.anchor.set(0.5);
card.x = APP_WIDTH;
card.y = APP_HEIGHT;
card.width = ELE_WIDTH;
card.height = ELE_HEIGHT;

const cardTexture = PIXI.Texture.fromImage(IMAGE_PATH + '/' + CARD);
const cardImg = new PIXI.Sprite(cardTexture);
cardImg.anchor.set(0.5);
cardImg.width = 10;  // ??? 不明白
cardImg.height = 10; // ??? 不明白
card.addChild(cardImg);

/* 建立容器 */
const container = new PIXI.Container();
container.width = app.screen.width;
container.height = app.screen.height;
container.pivot.x = container.x = app.screen.width / 2;
container.pivot.y = container.y = app.screen.height / 2;
/* 將底圖跟卡牌放進容器 */
container.addChild(back, card);
/* 遮罩要放在 app 底下 */
app.stage.addChild(mask);
/* 設定容器遮罩 */
container.mask = mask;
/* 容器與遮罩同一個 parent */
app.stage.addChild(container);

/* 觸發區域 */
const toggle = new PIXI.Graphics();
toggle.beginFill(0xff0000, 0);
toggle.drawRect(APP_WIDTH / 2, APP_HEIGHT / 2, APP_WIDTH, APP_HEIGHT);
toggle.pivot.x = APP_WIDTH / 2;
toggle.pivot.y = APP_HEIGHT / 2;
toggle.interactive = true; // 設定可以互動
toggle.buttonMode = true; // 當滑鼠滑過時顯示為手指圖示
/* 與容器、遮罩同一個 parent */
app.stage.addChild(toggle);

/* 下面就是行為邏輯 */
let dragFlag = false,
  moveFlag = true,
  trigger = null,
  ticker = null;

/* 找到指標所屬區塊 */
const findTrigger = (x, y) => {
  const posBlock = [
    ['TOP_LEFT', 'TOP', 'TOP_RIGHT'],
    ['LEFT', 'ILLEGAL', 'RIGHT'],
    ['BOTTOM_LEFT', 'BOTTOM', 'BOTTOM_RIGHT']
  ];
  let posX = 1,
    posY = 1;

  x -= (APP_WIDTH - ELE_WIDTH) / 2;
  y -= (APP_HEIGHT - ELE_HEIGHT) / 2;

  if (x < AREA_SIZE && x > 0) posX = 0;
  else if (x > ELE_WIDTH - AREA_SIZE && x < ELE_WIDTH) posX = 2;

  if (y < AREA_SIZE && y > 0) posY = 0;
  else if (y > ELE_HEIGHT - AREA_SIZE && y < ELE_HEIGHT) posY = 2;

  if (posX !== 1 && !(y > 0 && y < ELE_HEIGHT)) posX = 1;
  if (posY !== 1 && !(x > 0 && x < ELE_WIDTH)) posY = 1;

  return posBlock[posY][posX];
};

/* 區域行為對應表 */
const handlerMap = {
  TOP: {
    setParams: topCardParams,
    up: topSideUp,
    move: topSideMove,
    over: topSideOver
  },
  BOTTOM: {
    setParams: bottomCardParams,
    up: bottomSideUp,
    move: bottomSideMove,
    over: bottomSideOver
  },
  LEFT: {
    setParams: leftCardParams,
    up: leftSideUp,
    move: leftSideMove,
    over: leftSideOver
  },
  RIGHT: {
    setParams: rightCardParams,
    up: rightSideUp,
    move: rightSideMove,
    over: rightSideOver
  },
  BOTTOM_RIGHT: {
    setParams: bottomRightCardParams,
    up: bottomRightSideUp,
    move: bottomRightSideMove,
    over: bottomRightSideOver
  }
};

/* 重置之後做的事 */
const resetCallback = _ => {
  dragFlag = false;
  trigger = null;
  moveFlag = true;
};

/* 重置 */
const triggerReset = callback => {
  ticker && ticker.stop() && (ticker = null);
  if (trigger && handlerMap[trigger]) {
    const { up } = handlerMap[trigger];
    ticker = up(card, mask, callback);
  } else callback();
  return false;
};

/* 點擊(按下)行為監聽 */
toggle.on('pointerdown', _ => {
  dragFlag = true;
  return false;
});

/* 點擊(放開)行為監聽 */
toggle.on('pointerup', _ => {
  moveFlag = false;
  return triggerReset(resetCallback);
});

/* 滑鼠移動監聽 */
toggle.on('pointermove', ({ data: { global: { x, y } } }) => {
  if (!moveFlag) return false;
  /* hover */
  if (!dragFlag) {
    let callback = resetCallback;
    const activeTrigger = findTrigger(x, y);

    if (handlerMap[activeTrigger]) {
      const { setParams, over } = handlerMap[activeTrigger];

      callback = _ => {
        trigger = activeTrigger;
        /* 重置遮罩 */
        mask.refresh(ORIGIN_POINTS);
        /* 設定卡牌定位 */
        setParams(card);
        /* over 事件 */
        ticker = over(card, mask);
      };
    }

    if (activeTrigger !== trigger) triggerReset(callback);
    return false;
  }

  /* 拖曳 */
  if (handlerMap[trigger]) {
    const { move } = handlerMap[trigger];
    move(card, mask, done, opened)(x, y);
    return false;
  }
});

/* 開牌時候呼叫，解除所有行為監聽，並移除觸發區 */
export const done = _ => {
  toggle.off('pointerup');
  toggle.off('pointerdown');
  toggle.off('pointermove');
  app.stage.removeChild(toggle);
};

export const opened = _ => {
  card.anchor.set(0.5);
  card.getChildAt(0).anchor.set(0.5);
  card.rotation = 0;
  card.x = ORIGIN_POINTS[0][0];
  card.y = ORIGIN_POINTS[0][1];

  mask.refresh(ORIGIN_POINTS);
};

// const t = new PIXI.ticker.Ticker();
// t.add(deltaTime => {
//
//   /* 旋轉 1/4 圓 ，也就是 90 度 */
//   container.rotation = Math.PI * 2 * (1 / 4);
//   t.stop();
// });
// setTimeout(_ => t.start(), 3000);
