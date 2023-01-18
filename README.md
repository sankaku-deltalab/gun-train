# gun-train

Describer for Bullet hell.

## Usage

```ts
import {TGunFactory, TGunTrainUtility, TGun, TGunTrainState} from 'gun-train';

// 1. Define gun type
type GT = {
  props: {rank: number};
  values: {angleRad: number; speed: number};
};

// 2. Build gun
const GF = TGunFactory;
const Util = TGunTrainUtility;

const rawGun = GF.repeat(
  5,
  GF.sequential(
    GF.terminal<GT>({
      durationMs: 1000,
      calcFireTimes(props) {
        return Math.max(1, Math.floor(props.rank / 2));
      },
      calcValues(props, args) {
        const pi = Math.PI;
        const nWayCount = 5;
        const nWayAngle = Util.lerp(args.firedCount / args.firingTimes, pi / 4, pi / 2);
        const angles = Util.calcNWayAngles(nWayCount, nWayAngle);

        const burstCount = Math.max(1, Math.floor(props.rank / 2));
        const speeds = Util.calcLinearValues(burstCount, 1, 2);
        return [...Util.productArray(angles, speeds)].map(([angleRad, speed]) => ({values: {angleRad, speed}}));
      },
    }),
    GF.wait(500)
  )
);

const gun = TGun.compile(rawGun);

// 3. Run Gun
let state = TGunTrainState.new();
const r = TGunTrainState.update(state, gun, {rank: 10}, {deltaMs: 1000 / 60});
r.fires.forEach(fire => {
  // do firing
});
state = r.state;

```