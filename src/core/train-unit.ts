import {Fire, FiringPeriod} from './gun-train';
import {GunContext, GunTyping} from './gun-typing';
import {GunUnit, GunUnitArgs} from './gun-unit';

export type TrainUnit<Typing extends GunTyping> = {
  info: GunUnitCompileInfo;
  gunUnit: GunUnit<Typing>;
};

export type GunUnitCompileInfo = {
  startTimeMs: number;
  stopTimeMs: number;
};

export namespace TrainUnit {
  export function calcFires<T extends GunTyping>(
    unit: TrainUnit<T>,
    context: GunContext<T>,
    firingPeriod: FiringPeriod
  ): Fire<T>[] {
    const unitArgsArray: GunUnitArgs[] = calcGunUnitArgsArray(unit, context, firingPeriod);
    return unitArgsArray.flatMap(args => {
      const valuesArray = GunUnit.calcValues(unit.gunUnit, context, args);
      const fireTimeMs = args.unitTimeMs + unit.info.startTimeMs;
      const elapsedMs = firingPeriod.trainStopTimeMs - fireTimeMs;
      return valuesArray.map(v => ({
        fireTimeMs,
        elapsedMs,
        values: v,
      }));
    });
  }

  function calcGunUnitArgsArray<T extends GunTyping>(
    unit: TrainUnit<T>,
    context: GunContext<T>,
    firingPeriod: FiringPeriod
  ): GunUnitArgs[] {
    const gun = unit.gunUnit;
    const fireTimes = gun.fireTimes(context);
    if (fireTimes <= 0) return [];

    const firingDurationMs = gun.durationMs;
    const interval = firingDurationMs / fireTimes;

    const firingCountArray = Array(fireTimes)
      .fill(0)
      .map((_, i) => i);

    const allUnitArgs: GunUnitArgs[] = firingCountArray.map(i => ({
      unitTimeMs: i * interval,
      durationMs: firingDurationMs,
      firedCount: i,
      fireTimes,
    }));

    const unitTimeMsMin = firingPeriod.trainStartTimeMs - unit.info.startTimeMs;
    const unitTimeMsMax = firingPeriod.trainStopTimeMs - unit.info.startTimeMs;

    return allUnitArgs.filter(args => args.unitTimeMs >= unitTimeMsMin && args.unitTimeMs < unitTimeMsMax);
  }
}
