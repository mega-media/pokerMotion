import {
  PADDING,
  AREA_SIZE,
  ELE_HEIGHT,
  ELE_WIDTH,
  ORIGIN_POINTS,
  APP_WIDTH,
  APP_HEIGHT
} from '../constant';
import { clone } from 'ramda';
import { middleBetweenPoints, unSlopeBetweenPoints, angleBetweenPoints, slopeBetweenPoints } from '../points';

let maskPoints = clone([
    [0, ORIGIN_POINTS[0][1]],
    clone(ORIGIN_POINTS[1]),
    clone(ORIGIN_POINTS[1]),
    [ORIGIN_POINTS[2][0], ORIGIN_POINTS[3][1] + 2 * PADDING],
    [0, ORIGIN_POINTS[3][1] + 2 * PADDING]
  ]),
  cardOriginX = 0,
  cardOriginY = 0;

const _cardInit = (card) => {
  card.rotation = 90 * (Math.PI / 180);
  card.x = cardOriginX = ORIGIN_POINTS[0][0] + ELE_WIDTH / 2;
  card.y = cardOriginY = ORIGIN_POINTS[0][1] - ELE_HEIGHT / 2;
};

const _maskInit = (mask) => {
  mask.refresh([
    [0, ORIGIN_POINTS[0][1]],
    ORIGIN_POINTS[1],
    ORIGIN_POINTS[1],
    [ORIGIN_POINTS[2][0], ORIGIN_POINTS[3][1] + 2 * PADDING],
    [0, ORIGIN_POINTS[3][1] + 2 * PADDING]
  ]);
};

export const setCardParams = (card) => {
  card.pivot.x = ELE_WIDTH;
  card.pivot.y = ELE_HEIGHT;
  _cardInit(card);
};

const _moving = (card, mask) => (x, y) => {
  /* 定義邊界 */
  x = x >= cardOriginX ? cardOriginX - 1 : x;
  y = y <= cardOriginY ? cardOriginY + 1 : y;

  card.x = x;
  card.y = y;

  /* mask的座標 */
  const maskPosX = x + card.width / 2,
    maskPosY = y + card.height / 2;

  /* 與原點的垂直線斜率 */
  const unSlope = unSlopeBetweenPoints(
    maskPosX,
    ORIGIN_POINTS[1][0],
    maskPosY,
    ORIGIN_POINTS[1][1]
  );

  /* 與原點的中點座標 */
  const { x: middleX, y: middleY } = middleBetweenPoints(
    maskPosX,
    ORIGIN_POINTS[1][0],
    maskPosY,
    ORIGIN_POINTS[1][1]
  );

  /* 透過斜率跟中點座標求邊界交集點 */
  let leftPosX = middleX - (middleY - ORIGIN_POINTS[1][1]) / unSlope,
    rightPosY = middleY - unSlope * ( middleX - ORIGIN_POINTS[1][0]);

  const angle = angleBetweenPoints(ORIGIN_POINTS[1][0], maskPosX, rightPosY, maskPosY);
  card.rotation = (angle + 180) * (Math.PI / 180);

  /* 遮罩 */
  if (leftPosX <= ORIGIN_POINTS[0][0]) {
    /* 上四邊形 */
    const endPosY = rightPosY - unSlope * ELE_WIDTH;
    maskPoints[0] = [0, endPosY];
    maskPoints[1] = [ORIGIN_POINTS[0][0], endPosY];
    maskPoints[2] = [ORIGIN_POINTS[1][0], rightPosY];
    maskPoints[3] = [ORIGIN_POINTS[2][0], maskPoints[4][1]];
    mask.refresh(maskPoints);
  } else if (rightPosY >= ORIGIN_POINTS[2][1]) {
    /* 右四邊形 */
    const endPosX = ELE_HEIGHT / unSlope + leftPosX;
    maskPoints[0] = [0, ORIGIN_POINTS[0][1]];
    maskPoints[1] = [leftPosX, ORIGIN_POINTS[0][1]];
    maskPoints[2] = [endPosX, ORIGIN_POINTS[2][1]];
    maskPoints[3] = [endPosX, maskPoints[4][1]];
    mask.refresh(maskPoints);
  } else {
    /* 一般三角形 */
    maskPoints[0] = [0, ORIGIN_POINTS[0][1]];
    maskPoints[1] = [leftPosX, ORIGIN_POINTS[0][1]];
    maskPoints[2] = [ORIGIN_POINTS[1][0], rightPosY];
    maskPoints[3] = [ORIGIN_POINTS[2][0], maskPoints[4][1]];
    mask.refresh(maskPoints);
  }
  return false;
};

export const pointerMove = (card, mask, finishCallback, openedCallback) => {
  const move = _moving(card, mask);
  return (x, y) => {
    /* 減去外層的距離 */
    const posX = x - (APP_WIDTH - ELE_WIDTH) / 2,
      posY = y - (APP_HEIGHT - ELE_HEIGHT) / 2;

    if (posX <= (ELE_WIDTH / 4) || posY >= (ELE_HEIGHT / 4 * 3)) {
      /* restore */
      finishCallback();
      /* auto slide */
      const ticker = new PIXI.ticker.Ticker();

      /* 計算距離 */
      const lenX = Math.abs(cardOriginX - card.x),
        lenY = Math.abs(cardOriginY - card.y);

      if (lenX < lenY) {
        const endPos = [ORIGIN_POINTS[2][0] - card.width / 2, ORIGIN_POINTS[2][1] - card.height / 2];
        /* 斜率 */
        const slope = slopeBetweenPoints(card.x, endPos[0], card.y, endPos[1]);
        const getSlopeX = x => 4 / slope + x;

        /* 向下開 */
        ticker.add(deltaTime => {
          if ((card.y + 4 >= endPos[1] ) && (getSlopeX(card.x) >= endPos[0])) {
            ticker.stop();
            openedCallback();
            return false;
          }
          move(getSlopeX(card.x), card.y + 4);
        });

      } else {
        const endPos = [ORIGIN_POINTS[0][0] - card.width / 2, ORIGIN_POINTS[0][1] - card.height / 2];
        /* 斜率 */
        const slope = slopeBetweenPoints(card.x, endPos[0], card.y, endPos[1]);
        const getSlopeY = y => slope * -1 * 4 + y;

        /* 向左開 */
        ticker.add(deltaTime => {
          if ((card.x - 4 <= endPos[0] ) && (getSlopeY(card.y) <= endPos[1])) {
            ticker.stop();
            openedCallback();
            return false;
          }
          move(card.x - 4, getSlopeY(card.y));
        });
      }
      ticker.start();
    } else
    move(x, y);
  };
};

export const pointerOver = (card, mask) => {
  const move = _moving(card, mask);
  const ticker = new PIXI.ticker.Ticker(),
    limitX = cardOriginX - AREA_SIZE,
    limitY = cardOriginY + AREA_SIZE,
    limitPerSecond = 4;

  ticker.add(deltaTime => {
    if (card.x - limitPerSecond <= limitX) {
      ticker.stop();
      move(limitX, limitY);
      return false;
    }

    move(card.x - limitPerSecond, card.y + limitPerSecond);
  });
  ticker.start();
  return ticker;
};

export const pointerUp = (card, mask, finishCallback) => {
  const move = _moving(card, mask),
    ticker = new PIXI.ticker.Ticker();
  /* 斜率 */
  const slope = slopeBetweenPoints(card.x, cardOriginX, card.y, cardOriginY);
  const getSlopeY = y => slope * 8 + y,
    getSlopeX = x => -1 * 8 / slope + x;

  /* 計算距離 */
  const lenX = Math.abs(cardOriginX - card.x),
    lenY = Math.abs(cardOriginY - card.y);

  /* finish */
  const finish = _ => {
    ticker.stop();
    _cardInit(card);
    _maskInit(mask);
    finishCallback();
  };

  if (lenX < lenY) {
    /* 向上收 */
    ticker.add(deltaTime => {
      if ((card.y - 8 <= cardOriginY ) && (getSlopeX(card.x) >= cardOriginX)) {
        finish();
        return false;
      }
      move(getSlopeX(card.x), card.y - 8);
    });

  } else {
    /* 向右收 */
    ticker.add(deltaTime => {
      if ((card.x + 8 >= cardOriginX ) && (getSlopeY(card.y) <= cardOriginY)) {
        finish();
        return false;
      }
      move(card.x + 8, getSlopeY(card.y));
    });
  }

  ticker.start();
  return ticker;
};
