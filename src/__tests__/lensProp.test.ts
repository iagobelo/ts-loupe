import lensProp from '../lensProp';

describe('lensProp', () => {
  type User = { name: string };

  const user: User = { name: 'Len' };

  it('Get and set a object propertie from a given lens created using lensProp()', () => {
    const nameLens = lensProp<User>('name');
    const newName = 'Leon';

    expect(nameLens.get(user)).toEqual(user.name);
    expect(nameLens.set(newName)(user).name).toEqual(newName);
  });
});
