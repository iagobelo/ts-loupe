import lensProp from '../prop';

describe('lensProp', () => {
  type User = { name: string };

  it('Creates a lens using prop()', () => {
    const nameLens = lensProp<User>('name');

    expect(nameLens).toHaveProperty('get');
    expect(nameLens).toHaveProperty('set');
  });
});
