mod fixed_size_queue;
mod mt_rand;
mod rng_state_search;
mod utils;

use wasm_bindgen::prelude::*;

use crate::{
  mt_rand::{DeconstructedMtRand, MtRand},
  rng_state_search::search_rng_for_sequence,
};

#[wasm_bindgen]
pub fn find_seed(
  seed_estimate: u32,
  seed_offset: u32,
  seed_increment: u32,
  start_state: u32,
  search_depth: u32,
  target_sequence: Vec<u32>,
  target_sequence_hash: u32,
) -> Option<DeconstructedMtRand> {
  utils::set_panic_hook();

  for seed_index in (seed_offset..0xffffffff).step_by(seed_increment as usize) {
    let seed = if seed_index & 1 == 0 {
      seed_estimate - seed_index / 2
    } else {
      seed_estimate + seed_index / 2 + 1
    };

    let mut rng = MtRand::new(seed);
    rng.go_to(start_state);

    let sequence_found = search_rng_for_sequence(
      &mut rng,
      search_depth,
      |rng| rng.rand_int_pow2(3),
      &target_sequence,
      target_sequence_hash,
    );

    if sequence_found {
      return Some(DeconstructedMtRand::of(&rng));
    }
  }

  None
}
