import {FireValues, GunContext, GunTyping} from './gun-typing';
import {TrainUnit} from './train-unit';

/** Definition of runnable gun. */
export type GunTrain<Typing extends GunTyping> = {
  stopTimeMs: number;
  trainUnits: TrainUnit<Typing>[];
};

/** Representation of gun fire. */
export type Fire<Typing extends GunTyping> = {
  /** Fired time since 0ms (not since from `startTimeMs`). */
  fireTimeMs: number;
  /** Elapsed time since fired (= (startTimeMs+deltaMs - fireTimeMs)). */
  elapsedMs: number;
  /** Property of firing. User defined. */
  values: FireValues<Typing>;
};

export type FiringPeriod = {
  trainStartTimeMs: number;
  trainStopTimeMs: number;
};

export namespace GunTrain {
  /**
   * Calculates the fires for the given GunTrain within the specified time range.
   * Each Fires are contain elapsed time since the `prevTimeMs`.
   *
   * @example
   * const {done, fires} = GunTrain.calcFires(myGunTrain, context, 0, 500);
   * console.log(result.fires);
   */
  export function calcFires<T extends GunTyping>(
    train: GunTrain<T>,
    context: GunContext<T>,
    startTimeMs: number,
    deltaTimeMs: number,
    opt: {loop?: boolean} = {}
  ): {done: boolean; fires: Fire<T>[]} {
    const trainStopTimeMs = train.stopTimeMs;
    const stopMs = startTimeMs + deltaTimeMs;
    const startMs = Math.max(0, startTimeMs);

    if (trainStopTimeMs <= 0) return {done: true, fires: []};
    if (stopMs <= 0) return {done: false, fires: []};
    if (deltaTimeMs <= 0) return {done: false, fires: []};

    const loop = opt.loop ?? false;
    const cycleStart = Math.floor(startMs / trainStopTimeMs);
    const cycleMaxRaw = 1 + Math.floor(stopMs / trainStopTimeMs);
    const cycleStop = loop ? cycleMaxRaw : 1;

    const allFires: Fire<T>[] = [];
    for (let i = cycleStart; i < cycleStop; i++) {
      const offsetT = i * trainStopTimeMs;
      const startT = startMs - offsetT;
      const stopT = stopMs - offsetT;

      const firesRaw = calcFiresRaw(train, context, {
        trainStartTimeMs: startT,
        trainStopTimeMs: stopT,
      });

      const fires = firesRaw.map(f => ({
        fireTimeMs: f.fireTimeMs + offsetT,
        elapsedMs: f.elapsedMs,
        values: f.values,
      }));

      allFires.push(...fires);
    }

    const done = !loop && stopMs >= trainStopTimeMs;
    return {done, fires: allFires};
  }

  function calcFiresRaw<T extends GunTyping>(
    train: GunTrain<T>,
    context: GunContext<T>,
    firingPeriod: FiringPeriod
  ): Fire<T>[] {
    return train.trainUnits.flatMap(trainUnit => TrainUnit.calcFires(trainUnit, context, firingPeriod));
  }
}
