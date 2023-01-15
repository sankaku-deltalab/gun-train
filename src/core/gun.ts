import {CompiledGun} from './compiled-gun';
import {CompiledGunUnit} from './compiled-gun-unit';
import {GunTyping} from './gun-typing';

export interface Gun<Typing extends GunTyping> {
  compile(startTimeMs: number): {
    stopTimeMs: number;
    compiledGunUnits: CompiledGunUnit<Typing>[];
  };
}

export class TGun {
  static compile<Typing extends GunTyping>(gun: Gun<Typing>): CompiledGun<Typing> {
    const r = gun.compile(0);
    return {
      durationMs: r.stopTimeMs,
      gunUnits: r.compiledGunUnits,
    };
  }
}
