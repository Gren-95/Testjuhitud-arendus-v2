import { app } from '../src/index.js';

describe('App', () => {
  it('peab käivituma ilma veata', () => {
    expect(() => app()).not.toThrow();
  });
});

