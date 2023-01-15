import {CompiledGunUnit} from '../compiled-gun-unit';
import {Gun} from '../gun';
import {GunTyping} from '../gun-typing';

export class Parallel<Typing extends GunTyping> implements Gun<Typing> {
  constructor(private readonly subGuns: Gun<Typing>[]) {}

  compile(startTimeMs: number): {
    stopTimeMs: number;
    compiledGunUnits: CompiledGunUnit<Typing>[];
  } {
    // NOTE: I don't use `Array.flat` because it is too slow.
    const compiledGunUnits: CompiledGunUnit<Typing>[] = [];
    let maxStopTimeMs = startTimeMs;
    for (const gun of this.subGuns) {
      const {stopTimeMs: subStopTimeMs, compiledGunUnits: subCompiledGuns} = gun.compile(startTimeMs);
      compiledGunUnits.concat(subCompiledGuns);
      maxStopTimeMs = Math.max(maxStopTimeMs, subStopTimeMs);
    }

    return {
      stopTimeMs: maxStopTimeMs,
      compiledGunUnits,
    };
  }
}
