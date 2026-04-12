pub struct FixedSizeQueue<T: Copy> {
  array: Vec<T>,
  offset: usize,
  length: usize,
}

impl<T: Copy> FixedSizeQueue<T> {
  pub fn of(vec: Vec<T>) -> Self {
    let length = vec.len();
    Self {
      array: vec,
      offset: 0,
      length,
    }
  }

  pub fn array(&self) -> Vec<T> {
    let mut array = Vec::with_capacity(self.length);
    for i in 0..self.length {
      array.push(self.array[(self.offset + i) % self.length]);
    }

    array
  }

  pub fn shift_and_push(&mut self, element: T) -> T {
    let old_element = self.array[self.offset];
    self.array[self.offset] = element;

    self.offset += 1;
    if self.offset >= self.length {
      self.offset -= self.length;
    }

    old_element
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn length_0() {
    let length: usize = 1;
    let queue = FixedSizeQueue::of(vec![0; length]);
    assert_eq!(length, queue.length)
  }

  #[test]
  fn length_1() {
    let length = 10;
    let queue = FixedSizeQueue::of(vec![0; length]);
    assert_eq!(length, queue.length)
  }

  #[test]
  fn length_2() {
    let length: usize = 100;
    let queue = FixedSizeQueue::of(vec![0; length]);
    assert_eq!(length, queue.length)
  }

  #[test]
  fn array_eq_0() {
    let expected = vec![0];
    let queue = FixedSizeQueue::of(expected.clone());
    assert_eq!(expected, queue.array());
  }

  #[test]
  fn array_eq_1() {
    let expected = vec![1, 2, 3, 4, 5];
    let queue = FixedSizeQueue::of(expected.clone());
    assert_eq!(expected, queue.array());
  }

  #[test]
  fn shift_and_push_return() {
    let mut queue = FixedSizeQueue::of(vec![1, 2, 3, 4, 5]);
    let actual = queue.shift_and_push(6);
    assert_eq!(1, actual);
  }

  #[test]
  fn shift_and_push_array() {
    let mut queue = FixedSizeQueue::of(vec![1, 2, 3, 4, 5]);
    queue.shift_and_push(6);
    assert_eq!(vec![2, 3, 4, 5, 6], queue.array());
  }
}
