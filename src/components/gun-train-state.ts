import {Fire, GunTrain} from '../core/gun-train';
import {GunContext, GunTyping} from '../core/gun-typing';

export type GunTrainState = {
  currentTimeMs: number;
};

export namespace GunTrainState {
  export function create(): GunTrainState {
    return {currentTimeMs: 0};
  }

  export function update<T extends GunTyping>(
    state: GunTrainState,
    gunTrain: GunTrain<T>,
    context: GunContext<T>,
    deltaMs: number,
    opt: {loop?: boolean}
  ): [GunTrainState, {done: boolean; fires: Fire<T>[]}] {
    const {done, fires} = GunTrain.calcFires(gunTrain, context, state.currentTimeMs, deltaMs, opt);
    const newState = {currentTimeMs: done ? gunTrain.stopTimeMs : state.currentTimeMs + deltaMs};

    return [newState, {done, fires}];
  }
  export function isDone<T extends GunTyping>(state: GunTrainState, gunTrain: GunTrain<T>): boolean {
    return state.currentTimeMs >= gunTrain.stopTimeMs;
  }
}
