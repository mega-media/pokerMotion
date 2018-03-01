import { clone } from 'ramda';
import { middleBetweenPoints } from '../points';

export default (card, mask, options) => {
  const { APP_WIDTH, APP_HEIGHT, ELE_WIDTH, ELE_HEIGHT, ORIGIN_POINTS, AREA_SIZE, PADDING } = options;
  let maskPoints = clone(ORIGIN_POINTS),
    cardOriginX = 0,
    cardOriginY = 0;
  const limitPerSecond = 8;

  const _cardInit = _ => {
    card.x = cardOriginX = ORIGIN_POINTS[0][0] - card.width;
    card.y = cardOriginY = ORIGIN_POINTS[0][1];
  };

  const _maskInit = _ => {
    mask.refresh(ORIGIN_POINTS);
  };

  const _move = (x) => {
    card.x = x;
    x += card.width / 2;
    const { x: middleX } = middleBetweenPoints(x + ELE_WIDTH / 2, ORIGIN_POINTS[0][0], 0, 0);
    maskPoints[0][0] = maskPoints[3][0] = middleX;
    mask.refresh(maskPoints);
  };

  return {
    setParams: _cardInit,
    up: finishCallback => {
      const ticker = new PIXI.ticker.Ticker();
      const limit = cardOriginX;

      ticker.add(deltaTime => {
        if (card.x - limitPerSecond <= limit) {
          ticker.stop();
          _cardInit();
          _maskInit();
          finishCallback();
          return false;
        }
        _move(card.x - limitPerSecond);
      });
      ticker.start();
      return ticker;
    },
    move: (finishCallback, openedCallback) => (x, y) => {
      /* 減去外層的距離 */
      const posX = x - (APP_WIDTH - ELE_WIDTH) / 2;

      if (posX >= (ELE_WIDTH / 2)) {
        /* restore */
        finishCallback();

        /* auto slide */
        const ticker = new PIXI.ticker.Ticker();
        const limit = ORIGIN_POINTS[0][0];


        ticker.add(deltaTime => {
          if ((card.x + limitPerSecond) >= limit) {
            ticker.stop();
            openedCallback();
            return false;
          }
          _move(card.x + limitPerSecond);
        });
        ticker.start();

      } else if (posX > AREA_SIZE)
        _move(x - card.width / 2);
    },
    over: _ => {
      const ticker = new PIXI.ticker.Ticker();
      const limit = cardOriginX + AREA_SIZE;


      ticker.add(deltaTime => {
        if (card.x + limitPerSecond >= limit) {
          ticker.stop();
          _move(limit);
          return false;
        }
        _move(card.x + limitPerSecond);
      });
      ticker.start();
      return ticker;
    }
  };
}
