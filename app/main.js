import {
  PADDING,
  AREA_SIZE,
  ELE_HEIGHT,
  ELE_WIDTH,
  ORIGIN_POINTS,
  APP_WIDTH, APP_HEIGHT
} from './constant';
import { flatten, forEach } from 'ramda';
/* 區域行為對應表 */
import handlerMap from './mapping';

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
  this.beginFill(0x00ff00, 0.3);
  this.drawPolygon(flatten(maskPoints));
};

/* 遮罩 */
const mask = new PIXI.Graphics();
mask.beginFill(0x00ff00, 0.3);
mask.lineStyle(0);
mask.drawPolygon(flatten(ORIGIN_POINTS));
mask.pivot.x = ELE_WIDTH / 2;
mask.pivot.y = ELE_HEIGHT / 2;

/* 底圖 */
const back = new PIXI.Container();
back.width = ELE_WIDTH;
back.height = ELE_HEIGHT;
back.x = ORIGIN_POINTS[0][0];
back.y = ORIGIN_POINTS[0][1];
back.pivot.x = ELE_WIDTH / 2;
back.pivot.y = ELE_HEIGHT / 2;

const backBg = new PIXI.Graphics();
backBg.beginFill(0xffffff, 1);
backBg.lineStyle(0);
backBg.drawRoundedRect(0, 0, ELE_WIDTH, ELE_HEIGHT, 10);

const backImg = PIXI.Sprite.fromImage(IMAGE_PATH + '/' + BACK);
backImg.x = -15;
backImg.y = -15;
backImg.width = ELE_WIDTH + 30;
backImg.height = ELE_HEIGHT + 30;

back.addChild(backBg);
back.addChild(backImg);

/* 卡牌 */
const card = new PIXI.Container();
card.reset = _ => {
  card.width = ELE_WIDTH;
  card.height = ELE_HEIGHT;
  card.pivot.x = ELE_WIDTH / 2;
  card.pivot.y = ELE_HEIGHT / 2;
  card.x = ORIGIN_POINTS[2][0];
  card.y = ORIGIN_POINTS[2][1];
  card.rotation = 0;
};
card.reset();

const cardBg = new PIXI.Graphics();
cardBg.beginFill(0xffffff, 1);
cardBg.lineStyle(0);
cardBg.drawRoundedRect(0, 0, ELE_WIDTH, ELE_HEIGHT, 10);

const cardTexture = PIXI.Texture.fromImage(IMAGE_PATH + '/' + CARD);
const cardImg = new PIXI.Sprite(cardTexture);
cardImg.x = 0;
cardImg.y = 0;
cardImg.width = ELE_WIDTH;
cardImg.height = ELE_HEIGHT;

card.addChild(cardBg);
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
// app.stage.addChild(mask);
/* 設定容器遮罩 */
// container.mask = mask;
/* 容器與遮罩同一個 parent */
app.stage.addChild(container);
app.stage.addChild(mask);
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
        /* 卡牌重置 */
        card.reset();
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
  card.width = ELE_WIDTH;
  card.height = ELE_HEIGHT;
  card.pivot.x = ELE_WIDTH / 2;
  card.pivot.y = ELE_HEIGHT / 2;
  card.x = ORIGIN_POINTS[0][0];
  card.y = ORIGIN_POINTS[0][1];
  card.rotation = 0;

  mask.refresh(ORIGIN_POINTS);
};
