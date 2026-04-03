import type { ChestQuality } from "~/data/mapped/probabilities/chest-quality-probabilities";

export interface EnemyDropInfo {
  readonly level: number;
  readonly groundArmorPoolId: number;
  readonly skellWeaponPoolId: number;
  readonly skellArmorPoolId: number;
}

export interface ChestDropInfo {
  readonly quality: ChestQuality;
  readonly sourceAppendageIndex: number;
}
