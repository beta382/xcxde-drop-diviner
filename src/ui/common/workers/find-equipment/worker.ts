import { MtRand } from "~/common/util/mt-rand";
import { groundAffixes, skellAffixes } from "~/data/mapped/affix";
import type { Affix } from "~/data/mapped/affix/affix";
import { enemyTemplates } from "~/data/mapped/enemy";
import { items } from "~/data/mapped/item";
import type { EquipmentTemplate } from "~/data/mapped/item/equipment";
import { Equipment } from "~/data/mapped/item/equipment";
import { classes } from "~/data/mapped/party";
import type {
  FindEquipmentWorker,
  FindEquipmentWorkerResult,
} from "~/ui/common/workers/find-equipment/find-equipment.types";
import type {
  CommandType,
  ResultSubtype,
} from "~/ui/common/workers/workers.types";

const affixes = { ground: groundAffixes, skell: skellAffixes };

interface EquipmentFilter {
  key: number;
  equipmentTemplate: EquipmentTemplate;
  traits: Affix[];
  augmentSlots: number;
}

class RngCache {
  readonly #cache: MtRand[];

  constructor(rng: MtRand) {
    this.#cache = [rng];
  }

  getRng(stateIndex: number): MtRand {
    this.#cache.sort((lhs, rhs) => lhs.stateIndex - rhs.stateIndex);

    const usableRngs = this.#cache.filter(
      (rng) => rng.stateIndex <= stateIndex,
    );

    if (usableRngs.length <= 0) {
      throw new RangeError("There should always be at least one usable RNG");
    }

    const rng = usableRngs[0];
    rng.goTo(stateIndex);

    if (usableRngs.length === 1) {
      this.#cache.push(rng.copy());
    }

    return rng;
  }
}

function searchExact(loot: Equipment[], filters: EquipmentFilter[]): boolean {
  if (loot.length !== filters.length) {
    return false;
  }

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    if (
      !loot[i].equals(
        filter.equipmentTemplate,
        filter.traits,
        filter.augmentSlots,
      )
    ) {
      return false;
    }
  }

  return true;
}

function searchFulfills(
  loot: Equipment[],
  filters: EquipmentFilter[],
): number[] {
  const results: number[] = [];
  filters.forEach((filter) => {
    for (const item of loot) {
      if (
        item.satisfies(
          filter.equipmentTemplate,
          filter.traits,
          filter.augmentSlots,
        )
      ) {
        results.push(filter.key);
        break;
      }
    }
  });

  return results;
}

function postProgress(progress: number): void {
  postMessage({ type: "progress", progress } satisfies ResultSubtype<
    FindEquipmentWorker,
    "progress"
  >);
}

function postIntermediateResult(result: FindEquipmentWorkerResult): void {
  postMessage({ type: "intermediateResult", result } satisfies ResultSubtype<
    FindEquipmentWorker,
    "intermediateResult"
  >);
}

function postTerminalResult(result: undefined | null): void {
  postMessage({ type: "terminalResult", result } satisfies ResultSubtype<
    FindEquipmentWorker,
    "terminalResult"
  >);
}

onmessage = ({
  data,
}: MessageEvent<CommandType<FindEquipmentWorker>>): void => {
  const initialRng = new MtRand(data.rng);
  const startState = initialRng.stateIndex;
  initialRng.advance(data.stateOffset);

  const rngCache = new RngCache(initialRng);

  const enemyTemplate = enemyTemplates[data.enemy.id];
  const enemy = enemyTemplate.createEnemy(
    data.enemy.level,
    data.enemy.brokenAppendages.map(
      (appendageIndex) => enemyTemplate.appendages[appendageIndex - 1],
    ),
  );

  const equipmentFilters: EquipmentFilter[] = data.equipmentFilters.map(
    (eqiupmentFilter) => ({
      key: eqiupmentFilter.key,
      equipmentTemplate: items[eqiupmentFilter.id] as EquipmentTemplate,
      traits: eqiupmentFilter.traits.map(
        ({ id, domain }) => affixes[domain][id],
      ),
      augmentSlots: eqiupmentFilter.augmentSlots,
    }),
  );

  const crossClass = classes[data.crossClassId];

  let foundAnything = false;

  let prevProgress = 0;
  let stateIndex = startState + data.stateOffset;
  while (stateIndex < startState + data.searchDepth) {
    const tmpRng = rngCache.getRng(stateIndex);
    const loot = enemy
      .rollItems(tmpRng, data.treasureSensor, crossClass)
      .filter((item) => item instanceof Equipment);

    if (data.exactMatch) {
      const isMatch = searchExact(loot, equipmentFilters);
      if (isMatch) {
        postIntermediateResult({
          equipmentFilterIndex: 0, // Unused
          stateIndex,
          offsetIndex: stateIndex - startState,
        });

        foundAnything = true;
      }
    } else {
      const results = searchFulfills(loot, equipmentFilters);
      results.forEach((equipmentFilterIndex) => {
        postIntermediateResult({
          equipmentFilterIndex,
          stateIndex,
          offsetIndex: stateIndex - startState,
        });

        foundAnything = true;
      });
    }

    stateIndex += data.stateIncrement;

    const progress = (stateIndex - startState) / data.searchDepth;
    if (progress >= prevProgress + data.progressNotifyPeriod) {
      postProgress(Math.min(1, progress));
      prevProgress = progress;
    }
  }

  postProgress(1);
  postTerminalResult(foundAnything ? undefined : null);
};
