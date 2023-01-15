export type GunTyping = {
  props: unknown;
  values: unknown;
};

export type GunProps<GT extends GunTyping> = GT['props'];
export type GunValues<GT extends GunTyping> = GT['values'];
