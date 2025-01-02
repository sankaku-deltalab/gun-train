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
    if (gunTrain.stopTimeMs <= 0) {
      return [state, {fires: [], done: true}];
    }

    return updateInternal(state, [], gunTrain, context, deltaMs, opt);
  }

  function updateInternal<T extends GunTyping>(
    state: GunTrainState,
    prevFires: Fire<T>[],
    gunTrain: GunTrain<T>,
    context: GunContext<T>,
    deltaMs: number,
    opt: {loop?: boolean}
  ): [GunTrainState, {done: boolean; fires: Fire<T>[]}] {
    const loop = opt.loop ?? false;

    const prevTimeMs = state.currentTimeMs;
    const currentTimeMs = prevTimeMs + deltaMs;
    const {done, fires} = GunTrain.calcFires(gunTrain, context, prevTimeMs, state.currentTimeMs, opt);

    const nextCurrentTimeMs = done ? gunTrain.stopTimeMs : loop ? currentTimeMs % gunTrain.stopTimeMs : currentTimeMs;
    const newState = {currentTimeMs: nextCurrentTimeMs};

    return [newState, {done, fires: [...prevFires, ...fires]}];
  }

  export function isDone<T extends GunTyping>(state: GunTrainState, gunTrain: GunTrain<T>): boolean {
    return state.currentTimeMs >= gunTrain.stopTimeMs;
  }
}
