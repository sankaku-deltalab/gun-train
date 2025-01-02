import {FireValues, GunContext, GunTyping} from './gun-typing';
import {TrainUnit} from './train-unit';

export type GunTrain<Typing extends GunTyping> = {
  stopTimeMs: number;
  trainUnits: TrainUnit<Typing>[];
};

export type Fire<Typing extends GunTyping> = {
  fireTimeMs: number;
  elapsedMs: number;
  values: FireValues<Typing>;
};

export type FiringPeriod = {trainPrevTimeMs: number; trainCurrentTimeMs: number};

export namespace GunTrain {
  export function calcFires<T extends GunTyping>(
    train: GunTrain<T>,
    context: GunContext<T>,
    prevTimeMs: number,
    currentTimeMs: number,
    opt: {loop?: boolean} = {}
  ): {done: boolean; fires: Fire<T>[]} {
    const loop = opt.loop ?? false;
    const firingPeriod = {trainPrevTimeMs: prevTimeMs, trainCurrentTimeMs: currentTimeMs};
    const {done, fires} = calcFiresRaw(train, context, firingPeriod);

    if (done && loop) {
      const deltaMsNotConsumed = currentTimeMs - train.stopTimeMs;
      return calcFires(train, context, 0, deltaMsNotConsumed, opt);
    }

    return {done, fires};
  }

  function calcFiresRaw<T extends GunTyping>(
    train: GunTrain<T>,
    context: GunContext<T>,
    firingPeriod: FiringPeriod
  ): {done: boolean; fires: Fire<T>[]} {
    const fires = train.trainUnits.flatMap(trainUnit => TrainUnit.calcFires(trainUnit, context, firingPeriod));
    const done = firingPeriod.trainCurrentTimeMs >= train.stopTimeMs;
    return {done, fires};
  }
}
