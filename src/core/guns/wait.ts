import {CompiledGunUnit} from '../compiled-gun-unit';
import {Gun} from '../gun';
import {GunTyping} from '../gun-typing';

export class Wait<Typing extends GunTyping> implements Gun<Typing> {
  constructor(private readonly waitTimeMs: number) {}

  compile(startTimeMs: number): {
    stopTimeMs: number;
    compiledGunUnits: CompiledGunUnit<Typing>[];
  } {
    return {
      stopTimeMs: startTimeMs + this.waitTimeMs,
      compiledGunUnits: [],
    };
  }
}
