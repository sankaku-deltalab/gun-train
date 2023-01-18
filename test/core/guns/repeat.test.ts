import {GunTyping, Gun} from '../../../src';
import {CompiledGunUnit} from '../../../src/core/compiled-gun-unit';
import {Repeat} from '../../../src/core/guns/repeat';

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

describe('Repeat', () => {
  test('compile sub-gun in repeat', () => {
    // Given
    const subGunOpt = {
      durationMs: 123,
      fakeCompiledGunUnits: [1, 2, 3],
    };
    const subGun = genSubGun(subGunOpt);
    const repeatCount = 42;
    const gun = new Repeat(repeatCount, subGun);

    // When
    const startTimeMs = 789;
    const compiledResult = gun.compile(startTimeMs);

    // Then
    const expectedStopTimeMs = startTimeMs + repeatCount * subGunOpt.durationMs;
    expect(compiledResult.stopTimeMs).toBeCloseTo(expectedStopTimeMs);

    const expectedCompiledGunUnits = Array(repeatCount)
      .fill(0)
      .map(_ => subGunOpt.fakeCompiledGunUnits)
      .reduce((sum, subGuns) => [...sum, ...subGuns], []);
    expect(compiledResult.compiledGunUnits).toStrictEqual(expectedCompiledGunUnits);

    const expectedSubGunArguments = Array(repeatCount)
      .fill(0)
      .map((_, i) => [startTimeMs + i * subGunOpt.durationMs]);
    expect((subGun.compile as jest.Mock).mock.calls).toEqual(expectedSubGunArguments);
  });
});
