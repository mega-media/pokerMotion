import { clone } from 'ramda';
import {
  PADDING,
  AREA_SIZE,
  ELE_HEIGHT,
  ELE_WIDTH,
  ORIGIN_POINTS,
  APP_WIDTH,
  APP_HEIGHT
} from '../constant';
import { middleBetweenPoints } from '../points';

let maskPoints = clone(ORIGIN_POINTS),
  cardOriginX = 0,
  cardOriginY = 0;

const _cardInit = (card) => {
  card.x = cardOriginX = ORIGIN_POINTS[0][0] - card.width;
  card.y = cardOriginY = ORIGIN_POINTS[0][1];
};

const _maskInit = (mask) => {
  mask.refresh(ORIGIN_POINTS);
};

export const setCardParams = (card) => {
  card.anchor.set(0.5);
  card.getChildAt(0).anchor.set(0.5);
  card.rotation = 0;
  _cardInit(card);
};

const _moving = (card, mask) => (x) => {
  card.x = x;
  x += card.width / 2;
  const { x: middleX } = middleBetweenPoints(x + ELE_WIDTH / 2, ORIGIN_POINTS[0][0], 0, 0);
  maskPoints[0][0] = maskPoints[3][0] = middleX;
  mask.refresh(maskPoints);
};

export const pointerMove = (card, mask, finishCallback, openedCallback) => {
  const move = _moving(card, mask);
  return (x) => {
    /* 減去外層的距離 */
    const posX = x - (APP_WIDTH - ELE_WIDTH) / 2;

    if (posX >= (ELE_WIDTH / 2)) {
      /* restore */
      finishCallback();

      /* auto slide */
      const ticker = new PIXI.ticker.Ticker();
      const limit = ORIGIN_POINTS[0][0];
      const limitPerSecond = 4;

      ticker.add(deltaTime => {
        if ((card.x + limitPerSecond) >= limit) {
          ticker.stop();
          openedCallback();
          return false;
        }
        move(card.x + limitPerSecond);
      });
      ticker.start();

    } else if (posX > AREA_SIZE)
      move(x - card.width / 2);

  };
};

export const pointerOver = (card, mask) => {
  const move = _moving(card, mask);
  const ticker = new PIXI.ticker.Ticker();
  const limit = cardOriginX + AREA_SIZE;
  const limitPerSecond = 4;

  ticker.add(deltaTime => {
    if (card.x + limitPerSecond >= limit) {
      ticker.stop();
      move(limit);
      return false;
    }
    move(card.x + limitPerSecond);
  });
  ticker.start();
  return ticker;
};

export const pointerUp = (card, mask, finishCallback) => {
  const move = _moving(card, mask);
  const ticker = new PIXI.ticker.Ticker();
  const limit = cardOriginX;
  const limitPerSecond = 4;
  ticker.add(deltaTime => {
    if (card.x - limitPerSecond <= limit) {
      ticker.stop();
      _cardInit(card);
      _maskInit(mask);
      finishCallback();
      return false;
    }
    move(card.x - limitPerSecond);
  });
  ticker.start();
  return ticker;
};
