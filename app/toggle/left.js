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
  card.x = ORIGIN_POINTS[0][0] - card.width;
  card.y = ORIGIN_POINTS[0][1];
};

export const pointerMove = (card, mask, finishCallback) => (x) => {
  /* 減去外層的距離 */
  const posX = x - (APP_WIDTH - ELE_WIDTH) / 2;

  if (posX >= (ELE_WIDTH / 2)) {
    /* restore */
    finishCallback();

    /* auto slide */
    const ticker = new PIXI.ticker.Ticker();
    const limit = APP_WIDTH / 2;
    const limitPerSecond = 4;

    ticker.add(deltaTime => {
      if ((card.x + limitPerSecond) >= limit) {
        ticker.stop();
        card.x = limit;

        maskPoints[0][0] = maskPoints[3][0] = ORIGIN_POINTS[0][0];
        mask.refresh(maskPoints);
        return false;
      }

      card.x += limitPerSecond;
      maskPoints[0][0] += limitPerSecond / 2;
      maskPoints[3][0] += limitPerSecond / 2;
      mask.refresh(maskPoints);
    });
    ticker.start();

  } else if (posX > AREA_SIZE) {
    card.x = x - card.width / 2;
    const { x: middleX } = middleBetweenPoints(x + ELE_WIDTH / 2, ORIGIN_POINTS[0][0], 0, 0);
    maskPoints[0][0] = maskPoints[3][0] = middleX;
    mask.refresh(maskPoints);
  }
};

export const pointerOver = (card, mask) => {
  const ticker = new PIXI.ticker.Ticker();
  const limit = ORIGIN_POINTS[0][0] - card.width + AREA_SIZE;
  const limitPerSecond = 4;

  ticker.add(deltaTime => {
    if (card.x + limitPerSecond >= limit) {
      ticker.stop();
      card.x = limit;

      maskPoints[0][0] = maskPoints[3][0] = ORIGIN_POINTS[0][0] + AREA_SIZE / 2;
      mask.refresh(maskPoints);
      return false;
    }

    card.x += limitPerSecond;

    maskPoints[0][0] += limitPerSecond / 2;
    maskPoints[3][0] += limitPerSecond / 2;
    mask.refresh(maskPoints);
  });
  ticker.start();
  return ticker;
};

export const pointerUp = (card, mask, finishCallback) => {
  const ticker = new PIXI.ticker.Ticker();
  const limit = ORIGIN_POINTS[0][0] - card.width;
  const limitPerSecond = 4;
  ticker.add(deltaTime => {
    if (card.x - limitPerSecond <= limit) {
      ticker.stop();
      card.x = limit;

      maskPoints[0][0] = maskPoints[3][0] = ORIGIN_POINTS[0][0];
      mask.refresh(maskPoints);
      finishCallback();
      return false;
    }

    card.x -= limitPerSecond;

    maskPoints[0][0] -= limitPerSecond / 2;
    maskPoints[3][0] -= limitPerSecond / 2;
    mask.refresh(maskPoints);
  });
  ticker.start();
  return ticker;
};
