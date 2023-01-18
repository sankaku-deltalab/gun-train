import {CompiledGunUnit} from '../compiled-gun-unit';
import {Gun} from '../gun';
import {GunTyping} from '../gun-typing';

export class Sequential<Typing extends GunTyping> implements Gun<Typing> {
  constructor(private readonly subGuns: Gun<Typing>[]) {}

  compile(startTimeMs: number): {
    stopTimeMs: number;
    compiledGunUnits: CompiledGunUnit<Typing>[];
  } {
    let currentStartTime = startTimeMs;

    // NOTE: I don't use `Array.flat` because it is too slow.
    let compiledGunUnits: CompiledGunUnit<Typing>[] = [];
    for (const gun of this.subGuns) {
      const {stopTimeMs: subStopTimeMs, compiledGunUnits: subCompiledGuns} = gun.compile(currentStartTime);
      currentStartTime = subStopTimeMs;
      compiledGunUnits = compiledGunUnits.concat(subCompiledGuns);
    }

    return {
      stopTimeMs: currentStartTime,
      compiledGunUnits,
    };
  }
}
