import {v4 as uuidv4} from 'uuid';
import {CompiledGunUnit} from '../compiled-gun-unit';
import {Gun} from '../gun';
import {GunTyping} from '../gun-typing';
import {GunUnit} from '../gun-unit';

export class Terminal<Typing extends GunTyping> implements Gun<Typing> {
  constructor(private readonly gunUnit: GunUnit<Typing>) {}

  compile(startTimeMs: number): {
    stopTimeMs: number;
    compiledGunUnits: CompiledGunUnit<Typing>[];
  } {
    const stopTimeMs = startTimeMs + this.gunUnit.durationMs;
    const compiledUnit: CompiledGunUnit<Typing> = {
      id: uuidv4(),
      startTimeMs,
      stopTimeMs,
      gunUnit: this.gunUnit,
    };

    return {
      stopTimeMs,
      compiledGunUnits: [compiledUnit],
    };
  }
}
