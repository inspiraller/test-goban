import { describe, expect, it } from 'vitest';
import { Goban } from '@/goban';

describe('Goban.is_taken', () => {
  it('white is taken when surrounded by black', () => {
    const goban = new Goban([
      '.#.',
      '#o#',
      '.#.',
    ]);

    expect(goban.is_taken(1, 1)).toBe(true); // x,y
  });

  it('white is not taken when it has a liberty', () => {
    const goban = new Goban([
      '...',
      '#o#',
      '.#.',
    ]);

    expect(goban.is_taken(1, 1)).toBe(false); // x,y
  });

  it('black shape is taken when surrounded', () => {
    const goban = new Goban([
      'oo.',
      '##o',  // 0,1, 1,1
      'o#o',  // 1,2
      '.o.',
    ]);

    expect(goban.is_taken(0, 1)).toBe(true);
    expect(goban.is_taken(1, 1)).toBe(true);
    expect(goban.is_taken(1, 2)).toBe(true);
  });

  it('black shape is not taken when it has a liberty', () => {
    const goban = new Goban([
      'oo.', //
      '##.', // 0,1 1,1
      'o#o', // 1,2
      '.o.',
    ]);

    expect(goban.is_taken(0, 1)).toBe(false);
    expect(goban.is_taken(1, 1)).toBe(false);
    expect(goban.is_taken(1, 2)).toBe(false);
  });

  it('square shape is taken', () => {
    const goban = new Goban([
      'oo.',
      '##o', // 0,1 1,1
      '##o', // 0,2 1,2
      'oo.',
    ]);

    expect(goban.is_taken(0, 1)).toBe(true);
    expect(goban.is_taken(0, 2)).toBe(true);
    expect(goban.is_taken(1, 1)).toBe(true);
    expect(goban.is_taken(1, 2)).toBe(true);
  });
});
