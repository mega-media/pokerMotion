import { clone } from 'ramda';
import {
  PADDING,
  AREA_SIZE,
  ELE_HEIGHT,
  ELE_WIDTH,
  ORIGIN_POINTS
} from '../constant';
import { done } from '../main';

let maskPoints = clone(ORIGIN_POINTS);

export const pointerMove = (card, mask) => (x) => {
  if (x >= (ELE_WIDTH / 2) + PADDING) {
    /* restore */
    done();

    /* auto slide */
    const ticker = new PIXI.ticker.Ticker();
    const limit = PADDING;
    const limitPerSecond = 4;

    ticker.add(deltaTime => {
      if ((card.x + limitPerSecond) >= limit) {
        ticker.stop();
        card.x = limit;

        maskPoints[0][0] = maskPoints[3][0] = PADDING;
        mask.refresh(maskPoints);
        return false;
      }

      card.x += limitPerSecond;
      maskPoints[0][0] += limitPerSecond / 2;
      maskPoints[3][0] += limitPerSecond / 2;
      mask.refresh(maskPoints);
    });
    ticker.start();

  } else if (x > PADDING + AREA_SIZE) {
    card.x = x - ELE_WIDTH;

    maskPoints[0][0] = maskPoints[3][0] = (x + PADDING) / 2;
    mask.refresh(maskPoints);
  }
};

export const pointerOver = (card, mask) => {
  const ticker = new PIXI.ticker.Ticker();
  const limit = PADDING - ELE_WIDTH + AREA_SIZE;
  const limitPerSecond = 4;

  ticker.add(deltaTime => {
    if (card.x + limitPerSecond >= limit) {
      ticker.stop();
      card.x = limit;

      maskPoints[0][0] = maskPoints[3][0] = PADDING + AREA_SIZE / 2;
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
  const limit = PADDING - ELE_WIDTH;
  const limitPerSecond = 4;
  ticker.add(deltaTime => {
    if (card.x - limitPerSecond <= limit) {
      ticker.stop();
      card.x = limit;

      maskPoints[0][0] = maskPoints[3][0] = PADDING;
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
