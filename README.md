# gun-train

Describer for Bullet hell.

## Usage

```ts
import {Gun, GunTrainUtility as Util, GunTrainState} from 'gun-train';

// 1. Define gun type
type GT = DefineGunType<{
  context: {rank: number};
  values: {angleRad: number; speed: number};
}>;

// 2. Build gun
const gunTrain = pipe(
  Gun.unitToTrain<GT>({
    durationMs: 1000,
    fireTimes: ({rank}) => Math.max(1, Math.floor(rank / 2)),
    values: ({rank}, args) => {
      const pi = Math.PI;
      const nWayCount = 5;
      const nWayAngle = Util.lerp(args.firedCount / args.firingTimes, pi / 4, pi / 2);
      const angles = Util.calcNWayAngles(nWayCount, nWayAngle);

      const burstCount = Math.max(1, Math.floor(rank / 2));
      const speeds = Util.calcLinearValues(burstCount, 1, 2);
      return [...Util.productArray(angles, speeds)].map(([angleRad, speed]) => ({values: {angleRad, speed}}));
    },
  }),
  train => Gun.wait(train, {afterMs: 500}),
  train => Gun.repeat(train, 5)
);

// 3. Run Gun
let state = GunTrainState.new();
const r = GunTrainState.update(state, gunTrain, {rank: 10}, {deltaMs: 1000 / 60});
r.fires.forEach(fire => {
  // do firing
});
state = r.state;

```