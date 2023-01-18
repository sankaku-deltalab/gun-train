import {CompiledGunUnit} from '../compiled-gun-unit';
import {Gun} from '../gun';
import {GunTyping} from '../gun-typing';

export class Repeat<Typing extends GunTyping> implements Gun<Typing> {
  constructor(private readonly counts: number, private readonly subGun: Gun<Typing>) {}

  compile(startTimeMs: number): {
    stopTimeMs: number;
    compiledGunUnits: CompiledGunUnit<Typing>[];
  } {
    let currentStartTime = startTimeMs;

    // NOTE: I don't use `Array.flat` because it is too slow.
    let compiledGunUnits: CompiledGunUnit<Typing>[] = [];
    for (let i = 0; i < this.counts; i++) {
      const {stopTimeMs: subStopTimeMs, compiledGunUnits: subCompiledGuns} = this.subGun.compile(currentStartTime);
      currentStartTime = subStopTimeMs;
      compiledGunUnits = compiledGunUnits.concat(subCompiledGuns);
    }

    return {
      stopTimeMs: currentStartTime,
      compiledGunUnits,
    };
  }
}
