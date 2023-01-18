import {GunTyping, Terminal} from '../../../src';
import {GunUnit} from '../../../src/core/gun-unit';

const genGunUnit = <Typing extends GunTyping>(durationMs: number): GunUnit<Typing> => {
  return {
    durationMs,
    calcFireTimes: jest.fn(),
    calcValues: jest.fn(),
  };
};

describe('Terminal', () => {
  test('compile gun unit', () => {
    // Given
    const durationMs = 123;
    const gunUnit = genGunUnit(durationMs);
    const gun = new Terminal(gunUnit);

    // When
    const startTimeMs = 789;
    const compiledResult = gun.compile(startTimeMs);

    // Then
    const expectedStopTimeMs = startTimeMs + durationMs;
    expect(compiledResult.stopTimeMs).toBeCloseTo(expectedStopTimeMs);

    expect(typeof compiledResult.compiledGunUnits[0].id).toBe('string'); // id must be uuid4

    const expectedCompiledGunUnitWithoutIds = [
      {
        id: undefined,
        startTimeMs,
        stopTimeMs: startTimeMs + durationMs,
        gunUnit,
      },
    ];
    const compiledGunUnitsWithoutIds = compiledResult.compiledGunUnits.map(compiledUnit => ({
      ...compiledUnit,
      id: undefined,
    }));
    expect(compiledGunUnitsWithoutIds).toEqual(expectedCompiledGunUnitWithoutIds);
  });
});
