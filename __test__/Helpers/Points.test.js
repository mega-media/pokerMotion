/**
 * Created by arShown on 2017/3/10.
 */
import {assert} from 'chai';
import {
    zeroThrow,
    slopeBetweenPoints,
    unSlopeBetweenPoints,
    middleBetweenPoints,
    sizeBetweenPoints,
    distanceBetweenPoints,
    angleBetweenPoints,
    getIntersectPosition,
    getMirrorPosition
} from 'Helpers/Points';

describe('Helpers.Points', () => {
    describe('#zeroThrow', ()=> {
        it('檢查算數溢位', ()=> {
            assert.strictEqual(zeroThrow(100, 20), 5);
            assert.strictEqual(zeroThrow(250, 80), 3.125, "格式為浮點數");
            assert.strictEqual(zeroThrow(0, 0), 0);
            assert.strictEqual(zeroThrow(0, 100), 0);
            assert.strictEqual(zeroThrow(100, 0), 0);
        });
    });

    describe('#slopeBetweenPoints', ()=> {
        it('兩點斜率', ()=> {
            assert.strictEqual(slopeBetweenPoints(2, 0, 0, 4), -2);
            assert.strictEqual(slopeBetweenPoints(1, 5, 2, 10), 2);
            assert.strictEqual(slopeBetweenPoints(6, 8, 0, 4), 2);
        });
    });

    describe('#unSlopeBetweenPoints', ()=> {
        it('兩點垂直線的斜率', ()=> {
            assert.strictEqual(unSlopeBetweenPoints(7, 3, -4, 6), 0.4);
            assert.strictEqual(unSlopeBetweenPoints(2, 0, 0, 4), 0.5);
            assert.strictEqual(unSlopeBetweenPoints(1, 5, 2, 10), -0.5);
        });
    });

    describe('#middleBetweenPoints', ()=> {
        it('兩點中點', ()=> {
            assert.deepEqual(middleBetweenPoints(0, -10, 0, 0), {x: -5, y: 0});
            assert.deepEqual(middleBetweenPoints(-3, 5, 2, 7), {x: 1, y: 4.5});
            assert.deepEqual(middleBetweenPoints(4, -6, 2, 6), {x: -1, y: 4});
        });
    });

    describe('#sizeBetweenPoints', ()=> {
        it('兩點間形成的三角形雙邊', ()=> {
            assert.deepEqual(sizeBetweenPoints(0, 10, 0, 0), {sizeLeft: 5, sizeRight: 0});
            assert.deepEqual(sizeBetweenPoints(-3, 5, 3, 7), {sizeLeft: 5, sizeRight: 10});
        });
    });

    describe('#distanceBetweenPoints', ()=> {
        it('兩點之間的距離', ()=> {
            assert.strictEqual(distanceBetweenPoints(0, 10, 0, 0), 10);
            assert.strictEqual(distanceBetweenPoints(6, -2, -3, -9), 10);
            assert.strictEqual(distanceBetweenPoints(3, -3, -4, 4), 10);
        });
    });

    describe('#angleBetweenPoints', ()=> {
        it('兩點之間旋轉角度', ()=> {
            assert.strictEqual(angleBetweenPoints(0, 10, 0, 0), 180);
            assert.strictEqual(angleBetweenPoints(0, -10, 5, 5), 0);
            assert.strictEqual(angleBetweenPoints(2, 4, 3, 1), 135);
        });
    });

    describe('#getIntersectPosition', ()=> {
        it('兩線相交的座標', ()=> {
            assert.deepEqual(getIntersectPosition(3, 1, 8, 1, 0, 0), [0, 8]);
            assert.deepEqual(getIntersectPosition(5, -7, -24, 3, 10, 85), [5, 7]);
        });
    });

    describe('#getMirrorPosition', ()=> {
        it('取得目標座標的對稱點座標', ()=> {
            assert.deepEqual(getMirrorPosition(4, -4, 0, 0)(2, 0), {
                mirrorX: 2,
                mirrorY: 0
            });
            assert.deepEqual(getMirrorPosition(0, 0, 4, -4)(0, 1), {
                mirrorX: 0,
                mirrorY: -1
            });
        });
    });
});