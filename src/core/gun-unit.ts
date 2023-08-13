import {GunContext, GunTyping, FireValues} from './gun-typing';

export type GunUnitArgs = {
  /** Time from when this unit started until it fire. */
  unitTimeMs: number;

  /** Firing duration of this unit. */
  durationMs: number;

  /** Already fired count of this unit. At first fire, `firedCount` is 0. */
  firedCount: number;

  /** Total fire times of this unit. */
  fireTimes: number;
};

export type GunUnit<T extends GunTyping> = {
  /** Firing duration of this unit. This value is constant. */
  durationMs: number;

  fireTimes: (context: GunContext<T>) => number;
  values: (context: GunContext<T>, args: GunUnitArgs) => FireValues<T>[];
};

export namespace GunUnit {
  export function calcValues<T extends GunTyping>(
    unit: GunUnit<T>,
    context: GunContext<T>,
    args: GunUnitArgs
  ): FireValues<T>[] {
    return unit.values(context, args);
  }
}
