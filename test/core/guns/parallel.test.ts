import {CompiledGunUnit, GunTyping, Gun, Parallel} from '../../../src';

const genSubGun = <Typing extends GunTyping>(opt: {
  durationMs: number;
  fakeCompiledGunUnits: unknown[];
}): Gun<Typing> => {
  return {
    compile: jest.fn((startTimeMs: number) => {
      return {
        stopTimeMs: opt.durationMs + startTimeMs,
        compiledGunUnits: opt.fakeCompiledGunUnits as CompiledGunUnit<Typing>[],
      };
    }),
  };
};

describe('Parallel', () => {
  test('compile sub-guns parallel', () => {
    // Given
    const subGunOpts = [
      {
        durationMs: 123,
        fakeCompiledGunUnits: [1, 2, 3],
      },
      {
        durationMs: 456,
        fakeCompiledGunUnits: [4],
      },
      {
        durationMs: 0,
        fakeCompiledGunUnits: [],
      },
      {
        durationMs: 78,
        fakeCompiledGunUnits: [5, 6],
      },
    ];
    const subGuns = subGunOpts.map(opt => genSubGun(opt));
    const gun = new Parallel(subGuns);

    // When
    const startTimeMs = 789;
    const compiledResult = gun.compile(startTimeMs);

    // Then
    const expectedStopTimeMs = Math.max(...subGunOpts.map(opt => opt.durationMs + startTimeMs));
    expect(compiledResult.stopTimeMs).toBeCloseTo(expectedStopTimeMs);

    const expectedCompiledGunUnits = subGunOpts
      .map(opt => opt.fakeCompiledGunUnits)
      .reduce((sum, units) => sum.concat(units), []);
    expect(compiledResult.compiledGunUnits).toStrictEqual(expectedCompiledGunUnits);

    expect(subGuns[0].compile).toBeCalledWith(startTimeMs);
    expect(subGuns[1].compile).toBeCalledWith(startTimeMs);
    expect(subGuns[2].compile).toBeCalledWith(startTimeMs);
    expect(subGuns[3].compile).toBeCalledWith(startTimeMs);
  });
});
