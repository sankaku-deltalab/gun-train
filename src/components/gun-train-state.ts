import {CompiledGun, TCompiledGun} from '../core/compiled-gun';
import {GunProps, GunTyping, GunValues} from '../core/gun-typing';

export type GunTrainState = {
  nextStartTime: number;
};

export type GunTrainFire<Typing extends GunTyping> = {
  elapsedTimeMs: number;
  values: GunValues<Typing>;
};

export class TGunTrainState {
  static new(): GunTrainState {
    return {nextStartTime: 0};
  }

  static update<Typing extends GunTyping>(
    state: GunTrainState,
    compiledGun: CompiledGun<Typing>,
    props: GunProps<Typing>,
    args: {deltaMs: number; loop?: boolean}
  ): {state: GunTrainState; fires: GunTrainFire<Typing>[]; done: boolean} {
    if (compiledGun.durationMs <= 0) {
      return {
        state,
        fires: [],
        done: true,
      };
    }

    const startTimeMs = state.nextStartTime;
    const stopTimeMs = startTimeMs + args.deltaMs;
    const compiledFires = TCompiledGun.calcFires(compiledGun, props, {startTimeMs, stopTimeMs});
    const fires = compiledFires.map<GunTrainFire<Typing>>(f => ({
      elapsedTimeMs: f.fireTimeMs - startTimeMs,
      values: f.values,
    }));

    const newState = {nextStartTime: stopTimeMs};
    const done = this.isDone(newState, compiledGun);

    if (done && args.loop === true) {
      return {
        state: {nextStartTime: 0},
        fires,
        done: false,
      };
    }
    return {
      state: {nextStartTime: stopTimeMs},
      fires,
      done,
    };
  }

  static isDone<Typing extends GunTyping>(state: GunTrainState, compiledGun: CompiledGun<Typing>): boolean {
    return state.nextStartTime >= compiledGun.durationMs;
  }
}
