import lens from '../lens';
import lensSet from '../set';

describe('lensSet', () => {
  type User = { name: string };

  const user: User = { name: 'Len' };

  it('Set a object propertie from a given lens using lensSet()', () => {
    const getName = (user: User) => user.name;
    const setName = (name: User['name']) => (data: User) => ({ ...data, name });
    const nameLens = lens(getName, setName);
    const newName = 'Leon';

    expect(lensSet(nameLens)(newName)(user).name).toEqual(newName);
  });
});
