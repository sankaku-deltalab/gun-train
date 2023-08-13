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
    firingPeriod: FiringPeriod
  ): {done: boolean; fires: Fire<T>[]} {
    const fires = train.trainUnits.flatMap(trainUnit => TrainUnit.calcFires(trainUnit, context, firingPeriod));
    const done = firingPeriod.trainCurrentTimeMs > ~train.stopTimeMs;
    return {done, fires};
  }
}
