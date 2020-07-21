import lens from '../lens';

describe('lens', () => {
  type User = { name: string };

  const user: User = { name: 'Len' };

  it('Creates a new lens based on object', () => {
    const getName = (user: User) => user.name;
    const setName = (name: User['name']) => (data: User) => ({ ...data, name });
    const nameLens = lens(getName, setName);

    expect(nameLens.get(user)).toEqual(user.name);
    expect(nameLens.set('Leon')(user).name).toEqual('Leon');
  });
});
