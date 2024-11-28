import {GunTrainUtility} from '../../src/components/gun-train-utility';

describe('GunTrainUtility', () => {
  describe('range', () => {
    it('should generate a range of numbers', () => {
      const result = [...GunTrainUtility.range(3, 6)];
      expect(result).toEqual([3, 4, 5]);
    });
  });

  describe('calcLinearValues', () => {
    it.each`
      count | start | end   | justify     | expected
      ${3}  | ${1}  | ${10} | ${'start'}  | ${[1, 4, 7]}
      ${3}  | ${1}  | ${10} | ${'end'}    | ${[4, 7, 10]}
      ${3}  | ${1}  | ${10} | ${'center'} | ${[2.5, 5.5, 8.5]}
    `('should calculate linear values', ({count, start, end, justify, expected}) => {
      const result = GunTrainUtility.calcLinearValues(count, start, end, justify);
      expect(result).toEqual(expected);
    });
  });

  describe('calcNWayAngles', () => {
    it.each`
      count | angle  | justify      | expected
      ${3}  | ${180} | ${undefined} | ${[-60, 0, 60]}
      ${3}  | ${180} | ${'around'}  | ${[-60, 0, 60]}
      ${3}  | ${180} | ${'between'} | ${[-90, 0, 90]}
    `('should calculate N-way angles with $justify justify', ({count, angle, justify, expected}) => {
      const result = GunTrainUtility.calcNWayAngles(count, angle, justify);
      expect(result).toEqual(expected);
    });
  });

  describe('calcEveryDirectionAngles', () => {
    const PI = Math.PI;

    it.each`
      count | startAngle | justify     | expected
      ${4}  | ${0}       | ${'start'}  | ${[0, PI * (1 / 2), PI * (2 / 2), PI * (3 / 2)]}
      ${4}  | ${0}       | ${'end'}    | ${[PI * (1 / 2), PI * (2 / 2), PI * (3 / 2), PI * (4 / 2)]}
      ${4}  | ${0}       | ${'center'} | ${[PI * (1 / 4), PI * (3 / 4), PI * (5 / 4), PI * (7 / 4)]}
    `('should calculate every direction angles with $justify justify', ({count, startAngle, justify, expected}) => {
      const result = GunTrainUtility.calcEveryDirectionAngles(count, startAngle, justify);
      expect(result).toEqual(expected);
    });
  });

  describe('lerp', () => {
    it.each`
      t      | a    | b    | expected
      ${0}   | ${0} | ${1} | ${0}
      ${0.5} | ${0} | ${1} | ${0.5}
      ${1}   | ${0} | ${1} | ${1}
    `('should linearly interpolate between $a and $b with t=$t', ({t, a, b, expected}) => {
      expect(GunTrainUtility.lerp(t, a, b)).toBe(expected);
    });
  });

  describe('toRadians', () => {
    it('should convert degrees to radians', () => {
      const PI = Math.PI;
      expect(GunTrainUtility.toRadians(90)).toBe(PI / 2);
    });
  });

  describe('toDegrees', () => {
    it('should convert radians to degrees', () => {
      const PI = Math.PI;
      expect(GunTrainUtility.toDegrees(PI / 2)).toBe(90);
    });
  });

  describe('productArray', () => {
    it('should calculate the Cartesian product of one array', () => {
      const ary1 = [0, 1, 2];
      const result = [...GunTrainUtility.productArray(ary1)];
      expect(result).toEqual([[0], [1], [2]]);
    });

    it('should calculate the Cartesian product of two arrays', () => {
      const ary1 = [0, 1, 2];
      const ary2 = ['a', 'b'];
      const result = [...GunTrainUtility.productArray(ary1, ary2)];
      expect(result).toEqual([
        [0, 'a'],
        [0, 'b'],
        [1, 'a'],
        [1, 'b'],
        [2, 'a'],
        [2, 'b'],
      ]);
    });

    it('should calculate the Cartesian product of three arrays', () => {
      const ary1 = [0, 1];
      const ary2 = ['a', 'b'];
      const ary3 = [true, false];
      const result = [...GunTrainUtility.productArray(ary1, ary2, ary3)];
      expect(result).toEqual([
        [0, 'a', true],
        [0, 'a', false],
        [0, 'b', true],
        [0, 'b', false],
        [1, 'a', true],
        [1, 'a', false],
        [1, 'b', true],
        [1, 'b', false],
      ]);
    });

    it('should calculate the Cartesian product of four arrays', () => {
      const ary1 = [0];
      const ary2 = ['a'];
      const ary3 = [true];
      const ary4 = [null];
      const result = [...GunTrainUtility.productArray(ary1, ary2, ary3, ary4)];
      expect(result).toEqual([[0, 'a', true, null]]);
    });
  });
});
