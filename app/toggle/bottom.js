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

let maskPoints = clone(ORIGIN_POINTS);

export const setCardParams = (card) => {
  card.x = ORIGIN_POINTS[3][0];
  card.y = ORIGIN_POINTS[3][1];
};

export const pointerMove = (card, mask,finishCallback) => (x, y) => {
  /* 減去外層的距離 */
  const posY = y - (APP_HEIGHT - ELE_HEIGHT) / 2;

  if (posY <= (ELE_HEIGHT / 2)) {
    /* restore */
    finishCallback();

    /* auto slide */
    const ticker = new PIXI.ticker.Ticker();
    const limit = APP_HEIGHT / 2;
    const limitPerSecond = 8;

    ticker.add(deltaTime => {
      if ((card.y - limitPerSecond) <= limit) {
        ticker.stop();
        card.y = limit;

        maskPoints[2][1] = maskPoints[3][1] = ORIGIN_POINTS[2][1];
        mask.refresh(maskPoints);
        return false;
      }

      card.y -= limitPerSecond;
      maskPoints[2][1] -= limitPerSecond / 2;
      maskPoints[3][1] -= limitPerSecond / 2;
      mask.refresh(maskPoints);
    });
    ticker.start();

  } else if (posY < (ELE_HEIGHT - AREA_SIZE)) {
    card.y = y + card.height / 2;
    const { y: middleY } = middleBetweenPoints(0, 0, y + ELE_HEIGHT / 2, ORIGIN_POINTS[3][1]);
    maskPoints[2][1] = maskPoints[3][1] = middleY;
    mask.refresh(maskPoints);
  }
};

export const pointerOver = (card, mask) => {
  const ticker = new PIXI.ticker.Ticker();
  const limit = ORIGIN_POINTS[3][1] - AREA_SIZE;
  const limitPerSecond = 8;

  ticker.add(deltaTime => {
    if (card.y - limitPerSecond <= limit) {
      ticker.stop();
      card.y = limit;

      maskPoints[2][1] = maskPoints[3][1] = ORIGIN_POINTS[2][1] - AREA_SIZE / 2;
      mask.refresh(maskPoints);
      return false;
    }

    card.y -= limitPerSecond;

    maskPoints[2][1] -= limitPerSecond / 2;
    maskPoints[3][1] -= limitPerSecond / 2;
    mask.refresh(maskPoints);
  });
  ticker.start();
  return ticker;
};

export const pointerUp = (card, mask, finishCallback) => {
  const ticker = new PIXI.ticker.Ticker();
  const limit = ORIGIN_POINTS[3][1];
  const limitPerSecond = 8;
  ticker.add(deltaTime => {
    if (card.y + limitPerSecond >= limit) {
      ticker.stop();
      card.y = limit;

      maskPoints[2][1] = maskPoints[3][1] = ORIGIN_POINTS[2][1];
      mask.refresh(maskPoints);
      finishCallback();
      return false;
    }

    card.y += limitPerSecond;

    maskPoints[2][1] += limitPerSecond / 2;
    maskPoints[3][1] += limitPerSecond / 2;
    mask.refresh(maskPoints);
  });
  ticker.start();
  return ticker;
};
