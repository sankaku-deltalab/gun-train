export namespace GunTrainUtility {
  /**
   * @example
   * ```ts
   * [...GunTrainUtility.range(3, 6)] // [3, 4, 5]
   * ```
   */
  export function range(start: number, stop: number): Iterable<number> {
    return rangeRaw(start, stop);
  }

  /**
   * @example
   * ```ts
   * GunTrainUtility.calcLinearValues(3, 1, 10) // [1, 4, 7]
   * GunTrainUtility.calcLinearValues(3, 1, 10, "start") // [1, 4, 7]
   * GunTrainUtility.calcLinearValues(3, 1, 10, "end") // [4, 7, 10]
   * GunTrainUtility.calcLinearValues(3, 1, 10, "center") // [2.5, 5.5, 8.5]
   * ```
   */
  export function calcLinearValues(
    count: number,
    start: number,
    end: number,
    justify: 'start' | 'end' | 'center' = 'start'
  ): number[] {
    if (count <= 0) return [];

    const step = (end - start) / count;
    const offset = justify === 'start' ? 0 : justify === 'end' ? step : step / 2;
    return [...range(0, count)].map(i => i * step + start + offset);
  }

  /**
   * @example
   * ```ts
   * GunTrainUtility.calcNWayAngles(3, 180) // [-60, 0, 60]
   * GunTrainUtility.calcNWayAngles(3, 180, "around") // [-60, 0, 60]
   * GunTrainUtility.calcNWayAngles(3, 180, "between") // [-90, 0, 90]
   * ```
   */
  export function calcNWayAngles(
    wayCount: number,
    totalAngleRad: number,
    justify: 'around' | 'between' = 'around'
  ): number[] {
    if (wayCount <= 0) return [];
    if (wayCount === 1) return [0];

    const actualTotalAngleRad = justify === 'around' ? totalAngleRad * ((wayCount - 1) / wayCount) : totalAngleRad;
    const startAngleRad = -actualTotalAngleRad / 2;
    const distanceAngleRad = actualTotalAngleRad / (wayCount + 1);
    return [...range(0, wayCount)].map(i => i * distanceAngleRad + startAngleRad);
  }

  /**
   * @example
   * ```ts
   * const PI = Math.PI;
   * GunTrainUtility.calcEveryDirectionAngles(4, 0) // [0, PI*(1/2), PI*(2/2), PI*(3/2)]
   * GunTrainUtility.calcEveryDirectionAngles(4, 0, "start") // [0, PI*(1/2), PI*(2/2), PI*(3/2)]
   * GunTrainUtility.calcEveryDirectionAngles(4, -PI) // [-PI*(2/2), -PI*(1/2), 0, PI*(1/2)]
   * GunTrainUtility.calcEveryDirectionAngles(4, 0, "end") // [PI*(1/2), PI*(2/2), PI*(3/2), PI*(4/2)]
   * GunTrainUtility.calcEveryDirectionAngles(4, 0, "center")  // [PI*(1/4), PI*(3/4), PI*(5/4), PI*(7/4)]
   * ```
   */
  export function calcEveryDirectionAngles(
    wayCount: number,
    offset: number,
    justify: 'start' | 'end' | 'center' = 'start'
  ): number[] {
    return calcLinearValues(wayCount, offset, offset + 2 * Math.PI, justify);
  }

  /**
   * @example
   * ```ts
   * GunTrainUtility.lerp(0, 10, 20) // 10
   * GunTrainUtility.lerp(0.5, 10, 20) // 15
   * GunTrainUtility.lerp1, 10, 20) // 20
   * ```
   */
  export function lerp(r: number, min: number, max: number): number {
    return r * max + (1 - r) * min;
  }

  /**
   * @example
   * ```ts
   * const PI = Math.PI;
   * GunTrainUtility.toRadians(90) // PI / 2
   * ```
   */
  export function toRadians(degrees: number): number {
    return (degrees / 180) * Math.PI;
  }

  /**
   * @example
   * ```ts
   * const PI = Math.PI;
   * GunTrainUtility.toDegrees(PI / 2) // 90
   * ```
   */
  export function toDegrees(radians: number): number {
    return (radians / Math.PI) * 180;
  }

  /**
   * Cartesian product.
   *
   * @example
   * ```ts
   * const ary1 = [0, 1, 2];
   * const ary2 = ["a", "b"];
   * const prod = GunTrainUtility.productArray(ary1, ary2);
   * [...prod] // [[0, "a"], [0, "b"], [1, "a"], [1, "b"], [2, "a"], [2, "b"]]
   * ```
   */
  export const productArray: ProductArray = (<T1, T2, T3, T4>(ary1: T1[], ary2?: T2[], ary3?: T3[], ary4?: T4[]) => {
    if (ary2 === undefined) {
      return TProductArray.prodArray1(ary1);
    }
    if (ary3 === undefined) {
      return TProductArray.prodArray2(ary1, ary2);
    }
    if (ary4 === undefined) {
      return TProductArray.prodArray3(ary1, ary2, ary3);
    }
    return TProductArray.prodArray4(ary1, ary2, ary3, ary4);
  }) as ProductArray;
}

function* rangeRaw(start: number, stop: number): Generator<number> {
  for (let i = start; i < stop; i++) {
    yield i;
  }
}

type ProductArray = {
  <T1>(ary1: T1[]): Iterable<[T1]>;
  <T1, T2>(ary1: T1[], ary2: T2[]): Iterable<[T1, T2]>;
  <T1, T2, T3>(ary1: T1[], ary2: T2[], ary3: T3[]): Iterable<[T1, T2, T3]>;
  <T1, T2, T3, T4>(ary1: T1[], ary2: T2[], ary3: T3[], ary4: T4[]): Iterable<[T1, T2, T3, T4]>;
};

class TProductArray {
  static *prodArray1<T1>(ary1: T1[]): Generator<[T1]> {
    for (const v1 of ary1) {
      yield [v1];
    }
  }

  static *prodArray2<T1, T2>(ary1: T1[], ary2: T2[]): Generator<[T1, T2]> {
    for (const v1 of ary1) {
      for (const v2 of ary2) {
        yield [v1, v2];
      }
    }
  }

  static *prodArray3<T1, T2, T3>(ary1: T1[], ary2: T2[], ary3: T3[]): Generator<[T1, T2, T3]> {
    for (const v1 of ary1) {
      for (const v2 of ary2) {
        for (const v3 of ary3) {
          yield [v1, v2, v3];
        }
      }
    }
  }

  static *prodArray4<T1, T2, T3, T4>(ary1: T1[], ary2: T2[], ary3: T3[], ary4: T4[]): Generator<[T1, T2, T3, T4]> {
    for (const v1 of ary1) {
      for (const v2 of ary2) {
        for (const v3 of ary3) {
          for (const v4 of ary4) {
            yield [v1, v2, v3, v4];
          }
        }
      }
    }
  }
}
