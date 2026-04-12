use crate::{fixed_size_queue::FixedSizeQueue, mt_rand::MtRand};

pub fn search_rng_for_sequence<F>(
  rng: &mut MtRand,
  search_depth: u32,
  generate_next_value: F,
  target_sequence: &Vec<u32>,
  target_sequence_hash: u32,
) -> bool
where
  F: Fn(&mut MtRand) -> u32,
{
  if target_sequence.len() == 0 {
    return true;
  }

  if search_depth == 0 {
    return false;
  }

  let mut initial_rng_values = Vec::with_capacity(target_sequence.len());
  for _ in 0..target_sequence.len() {
    initial_rng_values.push(generate_next_value(rng));
  }

  let mut rng_value_hash = create_sequence_hash(&initial_rng_values);
  let mut rng_value_queue = FixedSizeQueue::of(initial_rng_values);

  let mut i = 0;
  loop {
    if target_sequence_hash == rng_value_hash
      && target_sequence == &rng_value_queue.array()
    {
      return true;
    }

    i += 1;
    if i >= search_depth {
      break;
    }

    let next_rng_value = generate_next_value(rng);
    let old_rng_value = rng_value_queue.shift_and_push(next_rng_value);
    rng_value_hash = alter_sequence_hash(
      rng_value_hash,
      target_sequence.len() as u32,
      old_rng_value,
      next_rng_value,
    )
  }

  false
}

pub fn create_sequence_hash(sequence: &Vec<u32>) -> u32 {
  let mut sequence_hash = 0;
  for element in sequence {
    sequence_hash =
      alter_sequence_hash(sequence_hash, sequence.len() as u32, 0, *element);
  }

  sequence_hash
}

fn alter_sequence_hash(
  old_sequence_hash: u32,
  sequence_size: u32,
  old_value: u32,
  next_value: u32,
) -> u32 {
  (old_sequence_hash ^ old_value.rotate_left(sequence_size) ^ next_value)
    .rotate_left(1)
}

#[cfg(test)]
mod tests {
  use super::*;

  fn search_rng_for_sequence_results(
    seed: u32,
    start_state: u32,
    search_depth: u32,
    pow: u32,
    target_sequence: Vec<u32>,
    expected_result: bool,
    expected_state_index: u32,
  ) {
    let mut rng = MtRand::new(seed);
    rng.advance(start_state);
    let target_sequence_hash = create_sequence_hash(&target_sequence);

    let actual_result = search_rng_for_sequence(
      &mut rng,
      search_depth,
      |rng| rng.rand_int_pow2(pow),
      &target_sequence,
      target_sequence_hash,
    );

    assert_eq!(expected_result, actual_result);
    assert_eq!(expected_state_index, rng.state_index());
  }

  #[test]
  fn search_rng_for_sequence_results_0() {
    search_rng_for_sequence_results(0, 0, 0, 31, vec![], true, 0);
  }

  #[test]
  fn search_rng_for_sequence_results_1() {
    search_rng_for_sequence_results(0, 0, 0, 31, vec![0], false, 0);
  }

  #[test]
  fn search_rng_for_sequence_results_2() {
    search_rng_for_sequence_results(
      0,
      0,
      1,
      31,
      vec![
        1178568022, 1273124119, 1535857466, 1813046880, 1294424481, 1842424189,
        1170127713, 1819459251, 909791748, 1339092841,
      ],
      true,
      10,
    );
  }

  #[test]
  fn search_rng_for_sequence_results_3() {
    search_rng_for_sequence_results(
      0,
      0,
      1,
      31,
      vec![
        0, 1273124119, 1535857466, 1813046880, 1294424481, 1842424189,
        1170127713, 1819459251, 909791748, 1339092841,
      ],
      false,
      10,
    );
  }

  #[test]
  fn search_rng_for_sequence_results_4() {
    search_rng_for_sequence_results(
      0,
      0,
      2,
      31,
      vec![
        0, 1273124119, 1535857466, 1813046880, 1294424481, 1842424189,
        1170127713, 1819459251, 909791748, 1339092841,
      ],
      false,
      11,
    );
  }

  #[test]
  fn search_rng_for_sequence_results_5() {
    search_rng_for_sequence_results(
      0,
      0,
      5,
      31,
      vec![1842424189, 1170127713, 1819459251, 909791748, 1339092841],
      false,
      9,
    );
  }

  #[test]
  fn search_rng_for_sequence_results_6() {
    search_rng_for_sequence_results(
      0,
      0,
      6,
      31,
      vec![1842424189, 1170127713, 1819459251, 909791748, 1339092841],
      true,
      10,
    );
  }

  #[test]
  fn search_rng_for_sequence_results_7() {
    search_rng_for_sequence_results(
      0x5a100f87,
      335,
      2,
      3,
      vec![6, 5, 2, 1, 3, 0, 7, 6, 0, 7, 7, 1],
      true,
      348,
    );
  }

  #[test]
  fn search_rng_for_sequence_results_8() {
    search_rng_for_sequence_results(
      0x5a100f87,
      100,
      400,
      3,
      vec![6, 5, 2, 1, 3, 0, 7, 6, 0, 7, 7, 1],
      true,
      348,
    );
  }
}
