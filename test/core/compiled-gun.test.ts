import {v4 as uuid4} from 'uuid';
import {GunTyping} from '../../src/core/gun-typing';
import {TCompiledGun, CompiledGun} from '../../src/core/compiled-gun';
import {CompiledGunUnit} from '../../src/core/compiled-gun-unit';
import {GunUnit} from '../../src';

const genCompiledGunUnit = (opt: {
  startTimeMs: number;
  stopTimeMs: number;
  gunUnitMethods: Omit<GunUnit<GunTyping>, 'durationMs'>;
}): CompiledGunUnit<GunTyping> => {
  return {
    id: uuid4(),
    startTimeMs: opt.startTimeMs,
    stopTimeMs: opt.stopTimeMs,
    gunUnit: {...opt.gunUnitMethods, durationMs: opt.stopTimeMs - opt.startTimeMs},
  };
};

const compiledGunFixture = (): {
  compiledGun: CompiledGun<GunTyping>;
  compiledGunUnits: CompiledGunUnit<GunTyping>[];
} => {
  const gunUnitOpts: {
    startTimeMs: number;
    stopTimeMs: number;
    gunUnitMethods: Omit<GunUnit<GunTyping>, 'durationMs'>;
  }[] = [
    {
      startTimeMs: 0,
      stopTimeMs: 10,
      gunUnitMethods: {
        calcFireTimes: jest.fn(() => 5),
        calcValues: jest.fn((props, args) => [{values: {idx: 0, props, args}}]),
      },
    },
    {
      startTimeMs: 10,
      stopTimeMs: 30,
      gunUnitMethods: {
        calcFireTimes: jest.fn(() => 10),
        calcValues: jest.fn((props, args) => [{values: {idx: 1, props, args}}]),
      },
    },
    {
      startTimeMs: 0,
      stopTimeMs: 30,
      gunUnitMethods: {
        calcFireTimes: jest.fn(() => 10),
        calcValues: jest.fn((props, args) => [{values: {idx: 2, props, args}}]),
      },
    },
  ];
  const compiledGunUnits: CompiledGunUnit<GunTyping>[] = gunUnitOpts.map(opt => genCompiledGunUnit(opt));
  const durationMs = 40;
  const compiledGun: CompiledGun<GunTyping> = {
    durationMs,
    gunUnits: compiledGunUnits,
  };
  return {compiledGun, compiledGunUnits};
};

describe('TCompiledGun', () => {
  describe('.calcFires', () => {
    test('get fires from units', () => {
      // Given
      const {compiledGun} = compiledGunFixture();

      // When
      const props = {a: 1};
      const args = {startTimeMs: 0, stopTimeMs: 5};
      const fires = TCompiledGun.calcFires(compiledGun, props, args);

      // Then
      expect(fires[0]).toEqual({
        fireTimeMs: 0,
        values: {idx: 0, props, args: {fireTimeMs: 0, firingDurationMs: 10, firedCount: 0, firingTimes: 5}},
      });
      expect(fires[1]).toEqual({
        fireTimeMs: 2,
        values: {idx: 0, props, args: {fireTimeMs: 2, firingDurationMs: 10, firedCount: 1, firingTimes: 5}},
      });
      expect(fires[2]).toEqual({
        fireTimeMs: 4,
        values: {idx: 0, props, args: {fireTimeMs: 4, firingDurationMs: 10, firedCount: 2, firingTimes: 5}},
      });
      expect(fires[3]).toEqual({
        fireTimeMs: 0,
        values: {idx: 2, props, args: {fireTimeMs: 0, firingDurationMs: 30, firedCount: 0, firingTimes: 10}},
      });
      expect(fires[4]).toEqual({
        fireTimeMs: 3,
        values: {idx: 2, props, args: {fireTimeMs: 3, firingDurationMs: 30, firedCount: 1, firingTimes: 10}},
      });
    });
  });
});
