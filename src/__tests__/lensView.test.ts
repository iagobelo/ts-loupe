import lens from '../lens';
import lensView from '../view';

describe('lensView', () => {
  type User = { name: string };

  const user: User = { name: 'Len' };

  it('View a object propertie from a given lens using lensView()', () => {
    const getName = (user: User) => user.name;
    const setName = (name: User['name']) => (data: User) => ({ ...data, name });
    const nameLens = lens(getName, setName);

    expect(lensView(nameLens)(user)).toEqual(user.name);
  });
});
