import {GunTrain, Gun, DefineGunType} from '../../src';

type GT = DefineGunType<{
  context: {};
  values: {};
}>;

const gunTrain = Gun.unitToTrain<GT>({
  durationMs: 1000,
  fireTimes: _ => 10,
  values: (_, _args) => {
    return [{}];
  },
});

describe('GunTrain', () => {
  describe('calcFires', () => {
    it.each`
      startTimeMs | deltaTimeMs | firesNum | done
      ${0}        | ${0}        | ${0}     | ${false}
      ${0}        | ${1}        | ${1}     | ${false}
      ${0}        | ${500}      | ${5}     | ${false}
      ${0}        | ${1000}     | ${10}    | ${true}
      ${0}        | ${2000}     | ${10}    | ${true}
      ${500}      | ${499}      | ${5}     | ${false}
      ${500}      | ${500}      | ${5}     | ${true}
      ${1000}     | ${1000}     | ${0}     | ${true}
    `('run', ({startTimeMs, deltaTimeMs, firesNum, done}) => {
      const context = {};
      const {done: doneActual, fires} = GunTrain.calcFires(gunTrain, context, startTimeMs, deltaTimeMs);

      expect(doneActual).toBe(done);
      expect(fires).toHaveLength(firesNum);
    });

    it.each`
      startTimeMs | deltaTimeMs | firesNum
      ${0}        | ${1999}     | ${20}
      ${0}        | ${2000}     | ${20}
      ${500}      | ${500}      | ${5}
      ${500}      | ${1000}     | ${10}
    `('run with loop', ({startTimeMs, deltaTimeMs, firesNum}) => {
      const context = {};
      const {done: doneActual, fires} = GunTrain.calcFires(gunTrain, context, startTimeMs, deltaTimeMs, {loop: true});

      expect(doneActual).toBe(false);
      expect(fires).toHaveLength(firesNum);
    });

    it.each`
      startTimeMs | deltaTimeMs | elapsedTimeMsList            | fireTimeMsList
      ${0}        | ${100}      | ${[100]}                     | ${[0]}
      ${10}       | ${100}      | ${[10]}                      | ${[100]}
      ${500}      | ${500}      | ${[500, 400, 300, 200, 100]} | ${[500, 600, 700, 800, 900]}
      ${900}      | ${500}      | ${[500, 400, 300, 200, 100]} | ${[900, 1000, 1100, 1200, 1300]}
    `('fires has elapsedTime and fireTime', ({startTimeMs, deltaTimeMs, elapsedTimeMsList, fireTimeMsList}) => {
      const context = {};
      const {done: doneActual, fires} = GunTrain.calcFires(gunTrain, context, startTimeMs, deltaTimeMs, {loop: true});

      const elapsedMsList = fires.map(f => f.elapsedMs);
      const fireMsList = fires.map(f => f.fireTimeMs);

      expect(doneActual).toBe(false);
      expect(elapsedMsList).toEqual(elapsedTimeMsList);
      expect(fireMsList).toEqual(fireTimeMsList);
    });
  });
});
