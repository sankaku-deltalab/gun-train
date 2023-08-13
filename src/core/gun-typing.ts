export type GunTyping = {
  context: unknown;
  values: unknown;
};

export type GunContext<GT extends GunTyping> = GT['context'];
export type FireValues<GT extends GunTyping> = GT['values'];
