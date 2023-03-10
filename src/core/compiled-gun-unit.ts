import {GunProps, GunTyping, GunValues} from './gun-typing';
import {GunUnit, GunUnitArgs} from './gun-unit';

export type CompiledGunUnit<Typing extends GunTyping> = {
  id: string;
  startTimeMs: number;
  stopTimeMs: number;

  gunUnit: GunUnit<Typing>;
};

export type CompiledGunUnitFire<Typing extends GunTyping> = {
  globalFireTimeMs: number;
  values: GunValues<Typing>;
};

export class TCompiledGunUnit {
  static calcFires<Typing extends GunTyping>(
    gunUnit: CompiledGunUnit<Typing>,
    props: GunProps<Typing>,
    args: {globalStartTimeMs: number; globalStopTimeMs: number}
  ): CompiledGunUnitFire<Typing>[] {
    const fireArgsArray = this.calcGunUnitArgsArray(gunUnit, props, args);
    const nestedFires = fireArgsArray.map(({localArgs, globalFireTimeMs}) => ({
      fires: gunUnit.gunUnit.calcValues(props, localArgs),
      globalFireTimeMs,
    }));

    // NOTE: I don't use `Array.flat` because it is too slow.
    const compiledFires: CompiledGunUnitFire<Typing>[] = [];
    for (const fires of nestedFires) {
      const globalFireTimeMs = fires.globalFireTimeMs;
      for (const fire of fires.fires) {
        compiledFires.push({globalFireTimeMs, values: fire.values});
      }
    }
    return compiledFires;
  }

  private static calcGunUnitArgsArray<Typing extends GunTyping>(
    gunUnit: CompiledGunUnit<Typing>,
    props: GunProps<Typing>,
    args: {globalStartTimeMs: number; globalStopTimeMs: number}
  ): {
    localArgs: GunUnitArgs;
    globalFireTimeMs: number;
  }[] {
    const firingTimes = gunUnit.gunUnit.calcFireTimes(props);
    if (firingTimes <= 0) return [];

    const firingDurationMs = gunUnit.gunUnit.durationMs;
    const interval = firingDurationMs / firingTimes;

    const firingCountArray = Array(firingTimes)
      .fill(0)
      .map((_, i) => i);

    const allLocalArgs = firingCountArray.map(i => ({
      fireTimeMs: i * interval,
      firingDurationMs,
      firedCount: i,
      firingTimes,
    }));

    return allLocalArgs
      .map(a => ({localArgs: a, globalFireTimeMs: a.fireTimeMs + gunUnit.startTimeMs}))
      .filter(({globalFireTimeMs: t}) => args.globalStartTimeMs <= t && t < args.globalStopTimeMs);
  }
}
