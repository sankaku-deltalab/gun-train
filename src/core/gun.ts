import {GunTyping} from './gun-typing';
import {GunUnit} from './gun-unit';
import {GunTrain} from './gun-train';
import {TrainUnit} from './train-unit';

export namespace Gun {
  export function unitToTrain<T extends GunTyping>(unit: GunUnit<T>): GunTrain<T> {
    return {
      stopTimeMs: unit.durationMs,
      trainUnits: [{info: {startTimeMs: 0, stopTimeMs: unit.durationMs}, gunUnit: unit}],
    };
  }

  export function wait<T extends GunTyping>(
    train: GunTrain<T>,
    opt: {beforeMs?: number; afterMs?: number}
  ): GunTrain<T> {
    const beforeMs = opt.beforeMs ?? 0;
    const afterMs = opt.afterMs ?? 0;
    return {
      stopTimeMs: train.stopTimeMs + beforeMs + afterMs,
      trainUnits: timeShiftTrainUnits(train.trainUnits, beforeMs),
    };
  }

  export function repeat<T extends GunTyping>(
    train: GunTrain<T>,
    opt: {times?: number; intervalMs?: number}
  ): GunTrain<T> {
    const times = opt.times ?? 1;
    const intervalMs = opt.intervalMs ?? 0;
    const durationMs = train.stopTimeMs;

    const newTrainUnits = new Array(times)
      .fill(0)
      .flatMap((_, i) => timeShiftTrainUnits(train.trainUnits, durationMs + i * intervalMs));

    return {
      stopTimeMs: times * (durationMs + intervalMs),
      trainUnits: newTrainUnits,
    };
  }

  export function sequential<T extends GunTyping>(trains: GunTrain<T>[]): GunTrain<T> {
    const [stopTimeMs, trainUnits] = trains.reduce<[number, TrainUnit<T>[]]>(
      ([currentDurationMs, units], t) => {
        const us = timeShiftTrainUnits(t.trainUnits, currentDurationMs);
        return [currentDurationMs + t.stopTimeMs, [...units, ...us]];
      },
      [0, []]
    );
    return {stopTimeMs, trainUnits};
  }

  export function parallel<T extends GunTyping>(trains: GunTrain<T>[]): GunTrain<T> {
    const stopTimeMs = Math.max(...trains.map(t => t.stopTimeMs));
    const trainUnits = trains.flatMap(t => t.trainUnits);
    return {stopTimeMs, trainUnits};
  }

  function timeShiftTrainUnits<T extends GunTyping>(units: TrainUnit<T>[], timeMs: number): TrainUnit<T>[] {
    return units.map(({info, gunUnit}) => {
      const newInfo = {
        startTimeMs: info.startTimeMs + timeMs,
        stopTimeMs: info.stopTimeMs + timeMs,
      };
      return {info: newInfo, gunUnit};
    });
  }
}
