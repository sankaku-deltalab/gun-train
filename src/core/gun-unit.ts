import {GunProps, GunTyping, GunValues} from './gun-typing';

export type GunUnitArgs = {
  fireTimeMs: number;
  firingDurationMs: number;
  firedCount: number;
  firingTimes: number;
};

export type GunUnitFire<Typing extends GunTyping> = {
  values: GunValues<Typing>;
};

export type GunUnit<Typing extends GunTyping> = {
  durationMs: number;

  calcFireTimes(props: GunProps<Typing>): number;
  calcValues(props: GunProps<Typing>, args: GunUnitArgs): GunUnitFire<Typing>[];
};
