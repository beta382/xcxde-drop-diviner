use wasm_bindgen::prelude::*;

const N: u32 = 624;
const M: u32 = 397;
const F: u32 = 1812433253;

pub struct MtRand {
  seed: u32,
  state: [u32; N as usize],
  countdown: u32,
  index_next: u32,
  twists: u32,
}

impl MtRand {
  pub fn new(seed: u32) -> Self {
    let mut mt_rand = Self {
      seed,
      state: [0; N as usize],
      countdown: 1,
      index_next: 0,
      twists: 0,
    };

    mt_rand.srand(seed);

    mt_rand
  }

  pub fn seed(&self) -> u32 {
    self.seed
  }

  pub fn state_index(&self) -> u32 {
    if self.twists == 0 {
      0
    } else {
      (self.twists - 1) * N + self.index_next
    }
  }

  pub fn rand_int_pow2(&mut self, pow: u32) -> u32 {
    self.rand31() & ((1 << pow) - 1)
  }

  pub fn advance(&mut self, mut count: u32) {
    while count >= self.countdown {
      count -= self.countdown;
      self.next_mt();
      self.index_next += 1;
    }

    self.index_next += count;
    self.countdown -= count;
  }

  pub fn go_to(&mut self, state_index: u32) {
    let current_state_index = self.state_index();

    if current_state_index < state_index {
      self.advance(state_index - current_state_index);
    } else if current_state_index > state_index {
      self.reset();
      self.advance(state_index);
    }
  }

  fn srand(&mut self, mut seed: u32) {
    self.state[0] = seed;
    for i in 1..N {
      seed = F.wrapping_mul(seed ^ (seed >> 30)) + i;
      self.state[i as usize] = seed;
    }
  }

  fn next_mt(&mut self) {
    self.index_next = 0;
    self.countdown = N;
    self.twists += 1;

    for i in 0..N {
      let x = (self.state[i as usize] & 0x80000000)
        | (self.state[if i == N - 1 { 0 } else { i + 1 } as usize]
          & 0x7fffffff);
      let mut x_a = x >> 1;
      if x & 1 == 1 {
        x_a ^= 0x9908b0df;
      }

      self.state[i as usize] =
        self.state[if i >= N - M { i - (N - M) } else { i + M } as usize] ^ x_a;
    }
  }

  fn rand31(&mut self) -> u32 {
    self.countdown -= 1;
    if self.countdown < 1 {
      self.next_mt();
    }

    let mut y = self.state[self.index_next as usize];
    self.index_next += 1;

    y ^= y >> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >> 18;

    y >> 1
  }

  fn reset(&mut self) {
    self.srand(self.seed);
    self.countdown = 1;
    self.index_next = 0;
    self.twists = 0;
  }
}

#[wasm_bindgen]
pub struct DeconstructedMtRand {
  pub seed: u32,
  state: [u32; N as usize],
  pub countdown: u32,
  pub index_next: u32,
  pub twists: u32,
}

impl DeconstructedMtRand {
  pub fn of(rng: &MtRand) -> Self {
    Self {
      seed: rng.seed,
      state: rng.state,
      countdown: rng.countdown,
      index_next: rng.index_next,
      twists: rng.twists,
    }
  }
}

#[wasm_bindgen]
impl DeconstructedMtRand {
  #[wasm_bindgen(getter)]
  pub fn state(&self) -> Vec<u32> {
    return self.state.to_vec();
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  fn rand_int_pow2(seed: u32, start_state: u32, pow: u32, expected: Vec<u32>) {
    let mut rng = MtRand::new(seed);
    rng.advance(start_state);

    let mut actual = vec![];
    for _ in 0..expected.len() {
      actual.push(rng.rand_int_pow2(pow));
    }

    assert_eq!(expected, actual);
  }

  #[test]
  fn rand_int_pow2_0() {
    rand_int_pow2(
      0,
      0,
      31,
      vec![
        1178568022, 1273124119, 1535857466, 1813046880, 1294424481, 1842424189,
        1170127713, 1819459251, 909791748, 1339092841,
      ],
    );
  }

  #[test]
  fn rand_int_pow2_1() {
    rand_int_pow2(
      0,
      1_000_000,
      31,
      vec![
        1048751862, 726838180, 729534938, 399811542, 1768953071, 1127234350,
        2112935324, 61665428, 1594359069, 1189590100,
      ],
    );
  }

  #[test]
  fn rand_int_pow2_2() {
    rand_int_pow2(
      0x5a100f87,
      336,
      3,
      vec![6, 5, 2, 1, 3, 0, 7, 6, 0, 7, 7, 1, 4, 1, 2, 3, 1, 7, 6, 4],
    );
  }

  fn advance_state_eq(seed: u32, start_state: u32, num_advances: u32) {
    let mut rng = MtRand::new(seed);
    manually_advance(&mut rng, start_state);

    rng.advance(num_advances);

    assert_eq!(rng.state_index(), start_state + num_advances);
  }

  #[test]
  fn advance_state_eq_0() {
    advance_state_eq(0, 0, 0);
  }

  #[test]
  fn advance_state_eq_1() {
    advance_state_eq(0, 10, 100);
  }

  #[test]
  fn advance_state_eq_2() {
    advance_state_eq(0, 584_921, 1_000_000);
  }

  #[test]
  fn advance_state_eq_3() {
    advance_state_eq(0, 1875, 584_921);
  }

  #[test]
  fn advance_state_eq_4() {
    advance_state_eq(0xe54ff5f7, 0, 0);
  }

  #[test]
  fn advance_state_eq_5() {
    advance_state_eq(0xe54ff5f7, 10, 100);
  }

  #[test]
  fn advance_state_eq_6() {
    advance_state_eq(0xe54ff5f7, 584_921, 1_000_000);
  }

  #[test]
  fn advance_state_eq_7() {
    advance_state_eq(0xe54ff5f7, 1875, 584_921);
  }

  fn advance_rng_eq(seed: u32, start_state: u32, num_advances: u32) {
    let mut rng = MtRand::new(seed);
    let mut expected_rng = MtRand::new(seed);
    manually_advance(&mut rng, start_state);
    manually_advance(&mut expected_rng, start_state + num_advances);

    rng.advance(num_advances);

    for _ in 0..10000 {
      assert_eq!(expected_rng.rand_int_pow2(31), rng.rand_int_pow2(31));
    }
  }

  #[test]
  fn advance_rng_eq_0() {
    advance_rng_eq(0, 0, 0);
  }

  #[test]
  fn advance_rng_eq_1() {
    advance_rng_eq(0, 10, 100);
  }

  #[test]
  fn advance_rng_eq_2() {
    advance_rng_eq(0, 584_921, 1_000_000);
  }

  #[test]
  fn advance_rng_eq_3() {
    advance_rng_eq(0, 1875, 584_921);
  }

  #[test]
  fn advance_rng_eq_4() {
    advance_rng_eq(0xe54ff5f7, 0, 0);
  }

  #[test]
  fn advance_rng_eq_5() {
    advance_rng_eq(0xe54ff5f7, 10, 100);
  }

  #[test]
  fn advance_rng_eq_6() {
    advance_rng_eq(0xe54ff5f7, 584_921, 1_000_000);
  }

  #[test]
  fn advance_rng_eq_7() {
    advance_rng_eq(0xe54ff5f7, 1875, 584_921);
  }

  fn go_to_state_eq(seed: u32, start_state: u32, target_state: u32) {
    let mut rng = MtRand::new(seed);
    manually_advance(&mut rng, start_state);

    rng.go_to(target_state);

    assert_eq!(rng.state_index(), target_state);
  }

  #[test]
  fn go_to_state_eq_0() {
    go_to_state_eq(0, 0, 1);
  }

  #[test]
  fn go_to_state_eq_1() {
    go_to_state_eq(0, 10, 100);
  }

  #[test]
  fn go_to_state_eq_2() {
    go_to_state_eq(0, 1_000_000, 584_921);
  }

  #[test]
  fn go_to_state_eq_3() {
    go_to_state_eq(0, 1875, 0);
  }

  #[test]
  fn go_to_state_eq_4() {
    go_to_state_eq(0xe54ff5f7, 0, 1);
  }

  #[test]
  fn go_to_state_eq_5() {
    go_to_state_eq(0xe54ff5f7, 10, 100);
  }

  #[test]
  fn go_to_state_eq_6() {
    go_to_state_eq(0xe54ff5f7, 1_000_000, 584_921);
  }

  #[test]
  fn go_to_state_eq_7() {
    go_to_state_eq(0xe54ff5f7, 1875, 0);
  }

  fn go_to_rng_eq(seed: u32, start_state: u32, target_state: u32) {
    let mut rng = MtRand::new(seed);
    let mut expected_rng = MtRand::new(seed);
    manually_advance(&mut rng, start_state);
    manually_advance(&mut expected_rng, target_state);

    rng.go_to(target_state);

    for _ in 0..10000 {
      assert_eq!(expected_rng.rand_int_pow2(31), rng.rand_int_pow2(31));
    }
  }

  #[test]
  fn go_to_rng_eq_0() {
    go_to_rng_eq(0, 0, 1);
  }

  #[test]
  fn go_to_rng_eq_1() {
    go_to_rng_eq(0, 10, 100);
  }

  #[test]
  fn go_to_rng_eq_2() {
    go_to_rng_eq(0, 1_000_000, 584_921);
  }

  #[test]
  fn go_to_rng_eq_3() {
    go_to_rng_eq(0, 1875, 0);
  }

  #[test]
  fn go_to_rng_eq_4() {
    go_to_rng_eq(0xe54ff5f7, 0, 1);
  }

  #[test]
  fn go_to_rng_eq_5() {
    go_to_rng_eq(0xe54ff5f7, 10, 100);
  }

  #[test]
  fn go_to_rng_eq_6() {
    go_to_rng_eq(0xe54ff5f7, 1_000_000, 584_921);
  }

  #[test]
  fn go_to_rng_eq_7() {
    go_to_rng_eq(0xe54ff5f7, 1875, 0);
  }

  fn manually_advance(rng: &mut MtRand, num_advances: u32) {
    for _ in 0..num_advances {
      rng.rand_int_pow2(1);
    }
  }
}
