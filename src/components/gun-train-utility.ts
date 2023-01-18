export class TGunTrainUtility {
  static range(start: number, stop: number): Iterable<number> {
    return rangeRaw(start, stop);
  }

  static calcLinearValues(
    count: number,
    start: number,
    end: number,
    justify: 'start' | 'end' | 'center' = 'start'
  ): number[] {
    if (count <= 0) return [];

    const step = (end - start) / count;
    const offset = justify === 'start' ? 0 : justify === 'end' ? step : step / 2;
    return [...this.range(0, count)].map(i => i * step + offset);
  }

  static calcNWayAngles(wayCount: number, totalAngleRad: number, justify: 'around' | 'between' = 'around'): number[] {
    if (wayCount <= 0) return [];
    if (wayCount === 1) return [0];

    const actualTotalAngleRad = justify === 'around' ? totalAngleRad / wayCount : totalAngleRad / (wayCount - 1);
    const startAngleRad = -actualTotalAngleRad / 2;
    const distanceAngleRad = actualTotalAngleRad / (wayCount + 1);
    return [...this.range(0, wayCount)].map(i => i * distanceAngleRad + startAngleRad);
  }

  static calcEveryDirectionAngles(wayCount: number, justify: 'start' | 'end' | 'center' = 'start'): number[] {
    return this.calcLinearValues(wayCount, 0, 2 * Math.PI, justify);
  }

  static lerp(r: number, min: number, max: number): number {
    return r * max + (1 - r) * min;
  }

  static toRadians(degrees: number): number {
    return (degrees / 180) * Math.PI;
  }

  static toDegrees(radians: number): number {
    return (radians / Math.PI) * 180;
  }

  /**
   * Cartesian product.
   */
  static productArray: ProductArray = (<T1, T2, T3, T4>(ary1: T1[], ary2?: T2[], ary3?: T3[], ary4?: T4[]) => {
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
