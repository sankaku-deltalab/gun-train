import {Wait} from '../../../src';

describe('Wait', () => {
  test('deal waited stop time and empty compiled units at compile', () => {
    // Given
    const durationMs = 123;
    const gun = new Wait(durationMs);

    // When
    const startTimeMs = 789;
    const compiledResult = gun.compile(startTimeMs);

    // Then
    const expectedStopTimeMs = startTimeMs + durationMs;
    expect(compiledResult.stopTimeMs).toBeCloseTo(expectedStopTimeMs);

    const expectedCompiledGunUnits: unknown[] = [];
    expect(compiledResult.compiledGunUnits).toStrictEqual(expectedCompiledGunUnits);
  });
});
