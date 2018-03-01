import Poker from './main';

window.onload = function () {
  const poker = new Poker({
    padding: 100,
    transparent: false,
    backgroundColor: 0x000000,
    cardImgSrc: 'src/faces/0_8.svg',
  });
  // poker.initaial();
  poker.start();
  console.log(poker);
};
