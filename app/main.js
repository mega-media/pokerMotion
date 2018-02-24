import {
  PADDING,
  AREA_SIZE,
  ELE_HEIGHT,
  ELE_WIDTH,
  ORIGIN_POINTS
} from './constant';
import { flatten, forEach } from 'ramda';
import {
  pointerMove as leftSideMove,
  pointerUp as leftSideUp,
  pointerOver as leftSideOver
} from './toggle/left';
import {
  pointerMove as rightSideMove,
  pointerUp as rightSideUp,
  pointerOver as rightSideOver
} from './toggle/right';

/* constant */
const IMAGE_PATH = 'src/faces';
const BACK = 'back.png';

/* build */
const app = new PIXI.Application(
  ELE_WIDTH + PADDING * 2,
  ELE_HEIGHT + PADDING * 2,
  {
    //transparent: true
    backgroundColor: 0x1099bb
  }
);
app.stage.interactive = true;
document.getElementById('container').appendChild(app.view);

PIXI.Graphics.prototype.refresh = function (maskPoints) {
  this.clear();
  this.beginFill(0x000000, 0);
  this.drawPolygon(flatten(maskPoints));
};

/* 遮罩 */
const mask = new PIXI.Graphics();
mask.beginFill(0x000000, 1);
mask.lineStyle(0);
mask.drawPolygon(flatten(ORIGIN_POINTS));

/* 底圖 */
const back = new PIXI.Graphics();
back.beginFill(0x000000, 1);
back.drawRect(PADDING, PADDING, ELE_WIDTH, ELE_HEIGHT);

/* 卡牌 */
const card = new PIXI.Sprite(PIXI.Texture.WHITE);
card.anchor.set(0);
// size
card.width = ELE_WIDTH;
card.height = ELE_HEIGHT;
card.x = ELE_WIDTH + PADDING * 2;
card.y = PADDING;

/* 內容 */
const container = new PIXI.Container();
container.x = 0;
container.y = 0;
container.width = app.screen.width;
container.height = app.screen.height;

container.addChild(back, card);
app.stage.addChild(mask);
container.mask = mask;
app.stage.addChild(container);

/* toggle */
const toggle = new PIXI.Graphics();
toggle.beginFill(0x000000, 0);
toggle.drawRect(PADDING, PADDING, ELE_WIDTH, ELE_HEIGHT);
toggle.interactive = true; // 設定可以互動
toggle.buttonMode = true; // 當滑鼠滑過時顯示為手指圖示
app.stage.addChild(toggle);

let dragFlag = false,
  moveFlag = true,
  trigger = null,
  ticker = null;

const findTrigger = (x, y) => {
  const posBlock = [
    ['TOP_LEFT', 'TOP', 'TOP_RIGHT'],
    ['LEFT', 'ILLEGAL', 'RIGHT'],
    ['BOTTOM_LEFT', 'BOTTOM', 'BOTTOM_RIGHT']
  ];
  let posX = 1,
    posY = 1;

  x -= PADDING;
  y -= PADDING;

  if (x < AREA_SIZE && x > 0) posX = 0;
  else if (x > ELE_WIDTH - AREA_SIZE && x < ELE_WIDTH) posX = 2;

  if (y < AREA_SIZE && y > 0) posY = 0;
  else if (y > ELE_HEIGHT - AREA_SIZE && y < ELE_HEIGHT) posY = 2;

  if (posX !== 1 && !(y > 0 && y < ELE_HEIGHT)) posX = 1;
  if (posY !== 1 && !(x > 0 && x < ELE_WIDTH)) posY = 1;

  return posBlock[posY][posX];
};

const handler = {
  LEFT: {
    cardPos: [PADDING - ELE_WIDTH, PADDING],
    up: leftSideUp,
    move: leftSideMove,
    over: leftSideOver
  },
  RIGHT: {
    cardPos: [PADDING + ELE_WIDTH, PADDING],
    up: rightSideUp,
    move: rightSideMove,
    over: rightSideOver
  }
};

const resetCallback = _ => {
  dragFlag = false;
  trigger = null;
  moveFlag = true;
};

const triggerReset = callback => {
  ticker && ticker.stop() && (ticker = null);
  if (trigger && handler[trigger]) {
    const { up } = handler[trigger];
    up(card, mask, callback);
  } else callback();
  return false;
};

toggle.on('pointerdown', _ => {
  dragFlag = true;
  return false;
});
toggle.on('pointerout', _ => triggerReset(resetCallback));
toggle.on('pointerup', _ => {
  moveFlag = false;
  return triggerReset(resetCallback);
});

toggle.on('pointermove', ({ data: { global: { x, y } } }) => {
  if (!moveFlag) return false;

  /* hover */
  if (!dragFlag) {
    let callback = resetCallback;
    const activeTrigger = findTrigger(x, y);

    if (handler[activeTrigger]) {
      const { cardPos: [posX, posY], over } = handler[activeTrigger];

      callback = _ => {
        trigger = activeTrigger;
        /* 卡片位置 */
        card.x = posX;
        card.y = posY;
        ticker = over(card, mask);
      };
    }

    if (activeTrigger !== trigger) triggerReset(callback);
    return false;
  }

  /* 拖曳 */
  if (handler[trigger]) {
    const { move } = handler[trigger];
    move(card, mask)(x);
    return false;
  }
});

export const done = _ => {
  toggle.off('pointerout');
  toggle.off('pointerup');
  toggle.off('pointerdown');
  toggle.off('pointermove');
  app.stage.removeChild(toggle);
};


