import {
  setCardParams as topCardParams,
  pointerMove as topSideMove,
  pointerUp as topSideUp,
  pointerOver as topSideOver
} from './toggle/top';
import {
  setCardParams as bottomCardParams,
  pointerMove as bottomSideMove,
  pointerUp as bottomSideUp,
  pointerOver as bottomSideOver
} from './toggle/bottom';
import {
  setCardParams as leftCardParams,
  pointerMove as leftSideMove,
  pointerUp as leftSideUp,
  pointerOver as leftSideOver
} from './toggle/left';
import {
  setCardParams as rightCardParams,
  pointerMove as rightSideMove,
  pointerUp as rightSideUp,
  pointerOver as rightSideOver
} from './toggle/right';
import {
  setCardParams as bottomRightCardParams,
  pointerMove as bottomRightSideMove,
  pointerUp as bottomRightSideUp,
  pointerOver as bottomRightSideOver
} from './toggle/bottom-right';
import {
  setCardParams as bottomLeftCardParams,
  pointerMove as bottomLeftSideMove,
  pointerUp as bottomLeftSideUp,
  pointerOver as bottomLeftSideOver
} from './toggle/bottom-left';

export default {
  TOP: {
    setParams: topCardParams,
    up: topSideUp,
    move: topSideMove,
    over: topSideOver
  },
  BOTTOM: {
    setParams: bottomCardParams,
    up: bottomSideUp,
    move: bottomSideMove,
    over: bottomSideOver
  },
  LEFT: {
    setParams: leftCardParams,
    up: leftSideUp,
    move: leftSideMove,
    over: leftSideOver
  },
  RIGHT: {
    setParams: rightCardParams,
    up: rightSideUp,
    move: rightSideMove,
    over: rightSideOver
  },
  BOTTOM_RIGHT: {
    setParams: bottomRightCardParams,
    up: bottomRightSideUp,
    move: bottomRightSideMove,
    over: bottomRightSideOver
  },
  BOTTOM_LEFT: {
    setParams: bottomLeftCardParams,
    up: bottomLeftSideUp,
    move: bottomLeftSideMove,
    over: bottomLeftSideOver
  }
};
