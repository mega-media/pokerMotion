import { has, mapObjIndexed, flatten, evolve, call, __ } from 'ramda';
/* 區域行為對應表 */
import handlerMap from './mapping';

/* PIXI */
PIXI.Graphics.prototype.refresh = function (maskPoints) {
  this.clear();
  this.beginFill(0x00ff00, 0.3);
  this.drawPolygon(flatten(maskPoints));
};

/* 找到指標所屬區塊 */
const _findTrigger = ({
  ELE_HEIGHT: height,
  ELE_WIDTH: width,
  AREA_SIZE: toggleSize,
  PADDING: padding
}) => {
  const posBlock = [
    ['TOP_LEFT', 'TOP', 'TOP_RIGHT'],
    ['LEFT', 'ILLEGAL', 'RIGHT'],
    ['BOTTOM_LEFT', 'BOTTOM', 'BOTTOM_RIGHT']
  ];

  return (x, y) => {
    let posX = 1,
      posY = 1;

    x -= padding;
    y -= padding;

    if (x < toggleSize && x > 0) posX = 0;
    else if (x > width - toggleSize && x < width) posX = 2;

    if (y < toggleSize && y > 0) posY = 0;
    else if (y > height - toggleSize && y < height) posY = 2;

    if (posX !== 1 && !(y > 0 && y < height)) posX = 1;
    if (posY !== 1 && !(x > 0 && x < width)) posY = 1;

    return posBlock[posY][posX];
  };
};

/* app */
const poker = function Poker(options = {}) {
  this.options = {
    width: 228,
    height: 348,
    padding: 60,
    toggleSize: 40,
    container: 'container',
    transparent: true,
    backgroundColor: 0x000000,
    backImgSrc: 'src/faces/back.png',
    cardImgSrc: 'src/faces/0_10.svg'
  };
  this.app = {};
  this.initaial(options);
};

/* 初始化 */
poker.prototype.initaial = function (options = {}) {
  this.options = mapObjIndexed(
    (n, key, obj) => (has(key, options) ? options[key] : obj[key]),
    this.options
  );
};

/* 開始 */
poker.prototype.start = function () {
  const {
    width,
    height,
    padding,
    toggleSize,
    container,
    transparent,
    backgroundColor,
    backImgSrc,
    cardImgSrc
  } = this.options;

  /* constant */
  const APP_WIDTH = width + 2 * padding;
  const APP_HEIGHT = height + 2 * padding;
  const ORIGIN_POINTS = [
    [APP_WIDTH / 2, APP_HEIGHT / 2],
    [APP_WIDTH / 2 + width, APP_HEIGHT / 2],
    [APP_WIDTH / 2 + width, APP_HEIGHT / 2 + height],
    [APP_WIDTH / 2, APP_HEIGHT / 2 + height]
  ];

  const app = new PIXI.Application(APP_WIDTH, APP_HEIGHT, {
    transparent,
    backgroundColor: backgroundColor
  });
  app.stage.interactive = true;
  document.getElementById(container).appendChild(app.view);
  this.app = app;

  /* 遮罩 */
  const mask = new PIXI.Graphics();
  mask.beginFill(0x00ff00, 0.3);
  mask.lineStyle(0);
  mask.drawPolygon(flatten(ORIGIN_POINTS));
  mask.pivot.x = width / 2;
  mask.pivot.y = height / 2;

  /* 底圖 */
  const back = new PIXI.Container();
  back.width = width;
  back.height = height;
  back.x = APP_WIDTH / 2;
  back.y = APP_HEIGHT / 2;
  back.pivot.x = width / 2;
  back.pivot.y = height / 2;

  const backBg = new PIXI.Graphics();
  backBg.beginFill(0xffffff, 1);
  backBg.lineStyle(0);
  backBg.drawRoundedRect(0, 0, width, height, 10);

  const backImg = PIXI.Sprite.fromImage(backImgSrc);
  backImg.x = width / 2;
  backImg.y = height / 2;
  backImg.width = width + 30;
  backImg.height = height + 30;
  backImg.anchor.set(0.5);

  back.addChild(backBg, backImg);

  /* 卡牌 */
  const card = new PIXI.Container();
  card.reset = _ => {
    card.width = width;
    card.height = height;
    card.pivot.x = width / 2;
    card.pivot.y = height / 2;
    card.x = APP_WIDTH / 2 + width;
    card.y = APP_HEIGHT / 2 + height;
    card.rotation = 0;
  };
  card.reset();

  const cardBg = new PIXI.Graphics();
  cardBg.beginFill(0xffffff, 1);
  cardBg.lineStyle(0);
  cardBg.drawRoundedRect(0, 0, width, height, 10);

  const cardTexture = PIXI.Texture.fromImage(cardImgSrc);
  const cardImg = new PIXI.Sprite(cardTexture);
  cardImg.x = width / 2;
  cardImg.y = height / 2;
  cardImg.width = width;
  cardImg.height = height;
  cardImg.anchor.set(0.5);

  card.addChild(cardBg);
  card.addChild(cardImg);
  /* 建立容器 */
  const masterContainer = new PIXI.Container();
  masterContainer.width = app.screen.width;
  masterContainer.height = app.screen.height;
  masterContainer.pivot.x = masterContainer.x = app.screen.width / 2;
  masterContainer.pivot.y = masterContainer.y = app.screen.height / 2;
  /* 將底圖跟卡牌放進容器 */
  masterContainer.addChild(back, card);
  /* 遮罩要放在 app 底下 */
  app.stage.addChild(mask);
  /* 設定容器遮罩 */
  masterContainer.mask = mask;
  /* 容器與遮罩同一個 parent */
  app.stage.addChild(masterContainer);

  /* 觸發區域 */
  const toggle = new PIXI.Graphics();
  toggle.beginFill(0xff0000, 0);
  toggle.drawRect(
    APP_WIDTH / 2,
    APP_HEIGHT / 2,
    APP_WIDTH,
    APP_HEIGHT
  );
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

  /* 重置之後做的事 */
  const resetCallback = _ => {
    dragFlag = false;
    trigger = null;
    moveFlag = true;
  };

  /* 開牌時候呼叫，解除所有行為監聽，並移除觸發區 */
  const done = _ => {
    toggle.off('pointerup');
    toggle.off('pointerdown');
    toggle.off('pointermove');
    app.stage.removeChild(toggle);
  };

  const opened = _ => {
    card.width = width;
    card.height = height;
    card.pivot.x = width / 2;
    card.pivot.y = height / 2;
    card.x = APP_WIDTH / 2;
    card.y = APP_HEIGHT / 2;
    card.rotation = 0;

    mask.refresh(ORIGIN_POINTS);
  };

  const options = {
    APP_WIDTH,
    APP_HEIGHT,
    ELE_HEIGHT: height,
    ELE_WIDTH: width,
    AREA_SIZE: toggleSize,
    PADDING: padding,
    ORIGIN_POINTS
  };

  /* 觸發區行為 */
  const handlers = mapObjIndexed((toggle) => {
    const { move, up, over, setParams } = toggle(card, mask, options);
    return {
      move: move(done, opened),
      up, over, setParams
    };
  }, handlerMap);

  /* 重置 */
  const triggerReset = callback => {
    ticker && ticker.stop() && (ticker = null);
    if (trigger && has(trigger, handlers)) {
      const { up } = handlers[trigger];
      ticker = up(callback);
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
  const findTrigger = _findTrigger(options);
  toggle.on('pointermove', ({ data: { global: { x, y } } }) => {
    if (!moveFlag) return false;
    /* hover */
    if (!dragFlag) {
      let callback = resetCallback;
      const activeTrigger = findTrigger(x, y);
      if (has(activeTrigger, handlers)) {
        const { setParams, over } = handlers[activeTrigger];

        callback = _ => {
          trigger = activeTrigger;
          /* 重置遮罩 */
          mask.refresh(ORIGIN_POINTS);
          /* 卡牌重置 */
          card.reset();
          /* 設定卡牌定位 */
          setParams();
          /* over 事件 */
          ticker = over();
        };
      }

      if (activeTrigger !== trigger) triggerReset(callback);
      return false;
    }

    /* 拖曳 */
    if (has(trigger, handlers)) {
      const { move } = handlers[trigger];
      move(x, y);
      return false;
    }
  });
};

/* 清除 */
poker.prototype.destroy = function (removeCanvas) {
  this.app.destroy(removeCanvas);
};

export default poker;
