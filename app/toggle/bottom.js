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
  card.x = cardOriginX = ORIGIN_POINTS[3][0];
  card.y = cardOriginY = ORIGIN_POINTS[3][1];
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

const _moving = (card, mask) => (y) => {
  card.y = y;
  y -= card.height / 2;
  const { y: middleY } = middleBetweenPoints(0, 0, y + ELE_HEIGHT / 2, ORIGIN_POINTS[3][1]);
  maskPoints[2][1] = maskPoints[3][1] = middleY;
  mask.refresh(maskPoints);
};

export const pointerMove = (card, mask, finishCallback, openedCallback) => {
  const move = _moving(card, mask);
  return (x, y) => {
    /* 減去外層的距離 */
    const posY = y - (APP_HEIGHT - ELE_HEIGHT) / 2;

    if (posY <= (ELE_HEIGHT / 2)) {
      /* restore */
      finishCallback();

      /* auto slide */
      const ticker = new PIXI.ticker.Ticker();
      const limit = ORIGIN_POINTS[0][1];
      const limitPerSecond = 8;

      ticker.add(deltaTime => {
        if ((card.y - limitPerSecond) <= limit) {
          ticker.stop();
          openedCallback();
          return false;
        }
        move(card.y - limitPerSecond);
      });
      ticker.start();

    } else if (posY < (ELE_HEIGHT - AREA_SIZE))
      move(y + card.height / 2);
  };
};

export const pointerOver = (card, mask) => {
  const move = _moving(card, mask);
  const ticker = new PIXI.ticker.Ticker();
  const limit = cardOriginY - AREA_SIZE;
  const limitPerSecond = 8;

  ticker.add(deltaTime => {
    if (card.y - limitPerSecond <= limit) {
      ticker.stop();
      move(limit);
      return false;
    }
    move(card.y - limitPerSecond);
  });
  ticker.start();
  return ticker;
};

export const pointerUp = (card, mask, finishCallback) => {
  const move = _moving(card, mask);
  const ticker = new PIXI.ticker.Ticker();
  const limit = cardOriginY;
  const limitPerSecond = 8;
  ticker.add(deltaTime => {
    if (card.y + limitPerSecond >= limit) {
      ticker.stop();
      _cardInit(card);
      _maskInit(mask);
      finishCallback();
      return false;
    }
    move(card.y + limitPerSecond);
  });
  ticker.start();
  return ticker;
};
