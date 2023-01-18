import {Gun} from '../core/gun';
import {GunTyping} from '../core/gun-typing';
import {GunUnit} from '../core/gun-unit';
import {Parallel} from '../core/guns/parallel';
import {Repeat} from '../core/guns/repeat';
import {Sequential} from '../core/guns/sequential';
import {Terminal} from '../core/guns/terminal';
import {Wait} from '../core/guns/wait';

export class TGunFactory {
  static terminal<Typing extends GunTyping>(gunUnit: GunUnit<Typing>): Gun<Typing> {
    return new Terminal(gunUnit);
  }

  static sequential<Typing extends GunTyping>(...subGuns: Gun<Typing>[]): Gun<Typing> {
    return new Sequential(subGuns);
  }

  static parallel<Typing extends GunTyping>(...subGuns: Gun<Typing>[]): Gun<Typing> {
    return new Parallel(subGuns);
  }

  static repeat<Typing extends GunTyping>(repeatTimes: number, subGun: Gun<Typing>): Gun<Typing> {
    return new Repeat(repeatTimes, subGun);
  }

  static wait<Typing extends GunTyping>(waitTimeMs: number): Gun<Typing> {
    return new Wait(waitTimeMs);
  }
}
