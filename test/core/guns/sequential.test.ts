import {GunTyping, Gun} from '../../../src';
import {CompiledGunUnit} from '../../../src/core/compiled-gun-unit';
import {Sequential} from '../../../src/core/guns/sequential';

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

describe('Sequential', () => {
  test('compile sub-guns sequentially', () => {
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
    const gun = new Sequential(subGuns);

    // When
    const startTimeMs = 789;
    const compiledResult = gun.compile(startTimeMs);

    // Then
    const expectedStopTimeMs = subGunOpts.map(opt => opt.durationMs).reduce((sum, d) => sum + d, startTimeMs);
    expect(compiledResult.stopTimeMs).toBeCloseTo(expectedStopTimeMs);

    const expectedCompiledGunUnits = subGunOpts
      .map(opt => opt.fakeCompiledGunUnits)
      .reduce((sum, units) => sum.concat(units), []);
    expect(compiledResult.compiledGunUnits).toStrictEqual(expectedCompiledGunUnits);

    expect(subGuns[0].compile).toBeCalledWith(startTimeMs);
    expect(subGuns[1].compile).toBeCalledWith(startTimeMs + subGunOpts[0].durationMs);
    expect(subGuns[2].compile).toBeCalledWith(startTimeMs + subGunOpts[0].durationMs + subGunOpts[1].durationMs);
    expect(subGuns[3].compile).toBeCalledWith(
      startTimeMs + subGunOpts[0].durationMs + subGunOpts[1].durationMs + subGunOpts[2].durationMs
    );
  });
});
