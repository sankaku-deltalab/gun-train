import {CompiledGunUnit, CompiledGunUnitFire, TCompiledGunUnit} from './compiled-gun-unit';
import {GunProps, GunTyping} from './gun-typing';

export type CompiledGun<Typing extends GunTyping> = {
  durationMs: number;
  gunUnits: CompiledGunUnit<Typing>[];
};

export class TCompiledGun {
  static calcFires<Typing extends GunTyping>(
    gun: CompiledGun<Typing>,
    props: GunProps<Typing>,
    args: {startTimeMs: number; stopTimeMs: number}
  ): CompiledGunUnitFire<Typing>[] {
    const firingUnits = this.getFiringUnits(gun, args);
    const argsForUnit = {
      globalStartTimeMs: args.startTimeMs,
      globalStopTimeMs: args.stopTimeMs,
    };
    const nestedFires = firingUnits.map(u => TCompiledGunUnit.calcFires(u, props, argsForUnit));

    // NOTE: I don't use `Array.flat` because it is too slow.
    const compiledFires: CompiledGunUnitFire<Typing>[] = [];
    for (const fires of nestedFires) {
      for (const fire of fires) {
        compiledFires.push(fire);
      }
    }
    return compiledFires;
  }

  private static getFiringUnits<Typing extends GunTyping>(
    gun: CompiledGun<Typing>,
    args: {startTimeMs: number; stopTimeMs: number}
  ): CompiledGunUnit<Typing>[] {
    if (args.startTimeMs >= gun.durationMs) return [];
    if (args.stopTimeMs < 0) return [];
    return gun.gunUnits.filter(unit => this.unitIsFiring(unit, args));
  }

  private static unitIsFiring<Typing extends GunTyping>(
    gunUnit: CompiledGunUnit<Typing>,
    args: {startTimeMs: number; stopTimeMs: number}
  ): boolean {
    if (args.startTimeMs >= gunUnit.stopTimeMs) return false;
    if (args.stopTimeMs < gunUnit.startTimeMs) return false;
    return true;
  }
}
