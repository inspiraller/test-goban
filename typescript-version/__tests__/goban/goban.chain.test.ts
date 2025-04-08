import { Goban } from '@/goban';

import { describe, it } from 'vitest';
import { expect } from 'vitest';

describe('unchain', () => {
  it('test1: Should capture center square with black chain marker 8', () => {
    const goban = new Goban([
      '.#.', 
      '#o#', 
      '.#.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '.#.', 
        '#8#', 
        '.#.'
      ]),
    );
  });
  it('test2: Should NOT capture center square if free space at the top', () => {
    const goban = new Goban([
      '...', 
      '#o#', 
      '.#.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '...', 
        '#o#', 
        '.#.'
      ]),
    );
  });
  it('test3: Should capture black at edge with qhite chain marker 3', () => {
    const goban = new Goban([
      'oo.',
      '##o',
      'o#o',  
      '.o.',
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        'oo.',
        '33o',
        'o3o',  
        '.o.',
      ]),
    );
  });
  it('test4: Should NOTE capture black at edge if free space at right', () => {
    const goban = new Goban([
      'oo.',
      '##.',
      'o#o',  
      '.o.',
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        'oo.',
        '##.',
        'o#o',  
        '.o.',
      ]),
    );
  });
  it('test5: Should capture black at edge when surrounded with white, with white chain marker 3', () => {
    const goban = new Goban([
      'oo.',
      '##o',
      '##o',  
      'oo.',
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        'oo.',
        '33o',
        '33o',  
        'oo.',
      ]),
    );
  });
  it('test6: custom: Should capture larger area with chain marker 8', () => {
    const goban = new Goban([
      '.###.', 
      '#ooo#', 
      '.#oo#', 
      '.#oo#', 
      '..##.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '.###.', 
        '#888#', 
        '.#88#', 
        '.#88#', 
        '..##.'
      ]),
    );
  });
  it('test7: custom: Should NOT capture larger area with chain marker 8 if space at bottom', () => {
    const goban = new Goban([
      '.###.', 
      '#ooo#', 
      '.#oo#', 
      '.#oo#', 
      '..#..'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '.###.', 
        '#ooo#', 
        '.#oo#', 
        '.#oo#', 
        '..#..'
      ]),
    );
  });

  it('test8: custom: Should NOT capture long vertical if space at top', () => {
    const goban = new Goban([
      'oo.', 
      '##.', 
      'o#o',
      'o#o',
      '.o.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        'oo.', 
        '##.', 
        'o#o',
        'o#o',
        '.o.'
      ]),
    );
  });

  it('test9: custom: Should NOT capture long vertical if space at middle', () => {
    const goban = new Goban([
      'oo.', 
      '##o', 
      'o#.',
      'o#o',
      '.o.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        'oo.', 
        '##o', 
        'o#.',
        'o#o',
        '.o.'
      ]),
    );
  });
  it('test10: custom: Should NOT capture long vertical if space at bottom', () => {
    const goban = new Goban([
      'oo.', 
      '##o', 
      'o#o',
      'o#o',
      '...'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        'oo.', 
        '##o', 
        'o#o',
        'o#o',
        '...'
      ]),
    );
  });
  it('test11: custom: Should NOT capture long horizontal if space at beginning', () => {
    const goban = new Goban([
      '.ooo.', 
      '.###o', 
      '.ooo.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '.ooo.', 
        '.###o', 
        '.ooo.'
      ]),
    );
  });
  it('test12: custom: Should NOT capture long horizontal if space at end', () => {
    const goban = new Goban([
      '.ooo.', 
      'o###.', 
      '.ooo.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '.ooo.', 
        'o###.', 
        '.ooo.'
      ]),
    );
  });

  it('test13: custom: Should  capture at end, even if first block not captured', () => {
    const goban = new Goban([
      '.ooo..o.', 
      'o###.o#o', 
      '.ooo..o.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '.ooo..o.', 
        'o###.o3o', 
        '.ooo..o.'
      ]),
    );
  });
  it('test14: custom: Should  capture at bottom, even if first block not captured', () => {
    const goban = new Goban([
      '.ooo.', 
      '#.#oo',
      'o#ooo', 
      '#....'
    ]);

    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '.ooo.', 
        '#.#oo',
        '8#ooo', 
        '#....'
      ]),
    );
  });
  it('test15: custom: White surrounds black from outside and inside', () => {
    const goban = new Goban([
      '.ooooo.', 
      'o#####o',
      'o##o##o', 
      'o#####o',
      '.ooooo.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '.ooooo.', 
        'o33333o',
        'o33o33o', 
        'o33333o',
        '.ooooo.'
      ]),
    );
  });
  it('test16: custom: Black surrounds White surrounds black from outside and inside', () => {
    const goban = new Goban([
      '.#######.', 
      '#ooooooo#', 
      '#o#####o#',
      '#o##o##o#', 
      '#o#####o#',
      '#ooooooo#', 
      '.#######.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '.#######.', 
        '#8888888#', 
        '#8#####8#',
        '#8##8##8#', 
        '#8#####8#',
        '#8888888#',
        '.#######.'
      ]),
    );
  });
  it('test17: custom: Black surrounds White surrounds black from outside and inside, with eye', () => {
    const goban = new Goban([
      '.#######.', 
      '#ooooooo#', 
      '#o#####o#',
      '#o##.##o#', 
      '#o#####o#',
      '#ooooooo#', 
      '.#######.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '.#######.', 
        '#8888888#', 
        '#8#####8#',
        '#8##.##8#', 
        '#8#####8#',
        '#8888888#', 
        '.#######.'
      ]),
    );
  });
  it('test18: custom: White surrounds black from outside and inside and has freedom from surrounding black', () => {
    const goban = new Goban([
      '.#######.', 
      '#ooooooo#', 
      '#o#####o#',
      '#o##o##o#', 
      '#o#####o#',
      '#ooooooo#', 
      '.###.###.'
    ]);
    expect(goban.getChainedBoard()).toEqual(
      expect.arrayContaining([
        '.#######.', 
        '#ooooooo#', 
        '#o33333o#',
        '#o33o33o#', 
        '#o33333o#',
        '#ooooooo#', 
        '.###.###.'
      ]),
    );
  });
})

// 4,789,18