import { describe, expect, it } from 'vitest';
import { Goban } from '@/goban';

describe('Goban.get_status', () => {
  it('Status out of range', () => {
    const goban = new Goban([
      '.#.',
      '#o#',
      '.#.',
    ]);
    expect(goban.get_status(-1, 9999999)).toBe(4); 
  });
  it('Status first corner = empty', () => {
    const goban = new Goban([
      '.#.',
      '#o#',
      '.#.',
    ]);
    expect(goban.get_status(0,0)).toBe(3); 
  });
  it('Status 2nd item is Black', () => {
    const goban = new Goban([
      '.#.',
      '#o#',
      '.#.',
    ]);
    expect(goban.get_status(1,0)).toBe(2); 
  });
  it('Status middle item is white', () => {
    const goban = new Goban([
      '.#.',
      '#o#',
      '.#.',
    ]);
    expect(goban.get_status(1,1)).toBe(1); 
  });
  it('Status middle item is white', () => {
    const goban = new Goban([
      '.#.',
      '#o#',
      '.#.',
    ]);
    expect(() => goban.get_status('wrong value' as unknown as number, 1))
  .toThrowError('Unknown goban value undefined');
  });

});
