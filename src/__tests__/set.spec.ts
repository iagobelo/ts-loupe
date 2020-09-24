import lens from '../lens';
import lensSet from '../set';

describe('lensSet', () => {
  type User = { name: string };

  it('Set a object propertie from a given lens using set()', () => {
    const user: User = { name: 'Len' };
    const getName = (user: User) => user.name;
    const setName = (name: User['name']) => (data: User) => ({ ...data, name });
    const nameLens = lens(getName, setName);
    const newName = 'Leon';

    expect(lensSet(nameLens)(newName)(user).name).toEqual(newName);
  });
});
