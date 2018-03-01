import { clone } from 'ramda';
import { middleBetweenPoints } from '../points';

export default (card, mask, options) => {
  const { APP_HEIGHT, ELE_HEIGHT, ORIGIN_POINTS, AREA_SIZE } = options;
  const limitPerSecond = 8;

  let maskPoints = clone(ORIGIN_POINTS),
    cardOriginX = 0,
    cardOriginY = 0;

  const _cardInit = _ => {
    card.x = cardOriginX = ORIGIN_POINTS[0][0];
    card.y = cardOriginY = ORIGIN_POINTS[0][1] - card.height;
  };

  const _maskInit = _ => {
    mask.refresh(ORIGIN_POINTS);
  };

  const _move = (y) => {
    card.y = y;
    y += card.height / 2;
    const { y: middleY } = middleBetweenPoints(0, 0, y + ELE_HEIGHT / 2, ORIGIN_POINTS[0][1]);
    maskPoints[0][1] = maskPoints[1][1] = middleY;
    mask.refresh(maskPoints);
  };

  return {
    setParams: _cardInit,
    up: finishCallback => {
      const ticker = new PIXI.ticker.Ticker();
      const limit = cardOriginY;

      ticker.add(deltaTime => {
        if (card.y - limitPerSecond <= limit) {
          ticker.stop();
          _cardInit();
          _maskInit();
          finishCallback();
          return false;
        }
        _move(card.y - limitPerSecond);
      });
      ticker.start();
      return ticker;
    },
    move: (finishCallback, openedCallback) => (x, y) => {
      /* 減去外層的距離 */
      const posY = y - (APP_HEIGHT - ELE_HEIGHT) / 2;
      //
      if (posY >= (ELE_HEIGHT / 2)) {
        /* restore */
        finishCallback();

        /* auto slide */
        const ticker = new PIXI.ticker.Ticker();
        const limit = ORIGIN_POINTS[0][1];
        const limitPerSecond = 8;

        ticker.add(deltaTime => {
          if ((card.y + limitPerSecond) >= limit) {
            ticker.stop();
            openedCallback();
            return false;
          }
          _move(card.y + limitPerSecond);
        });
        ticker.start();

      } else if (posY > AREA_SIZE)
        _move(y - card.height / 2);
    },
    over: _ => {
      const ticker = new PIXI.ticker.Ticker();
      const limit = cardOriginY + AREA_SIZE;

      ticker.add(deltaTime => {
        if (card.y + limitPerSecond >= limit) {
          ticker.stop();
          _move(limit);
          return false;
        }
        _move(card.y + limitPerSecond);
      });
      ticker.start();
      return ticker;
    }
  };
}