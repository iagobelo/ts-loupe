import lens from '../lens';

describe('lens', () => {
  type User = { name: string; age: number };

  it('Creates a new lens', () => {
    const getName = (user: User) => user.name;
    const setName = (name: User['name']) => (data: User) => ({ ...data, name });
    const nameLens = lens(getName, setName);

    expect(nameLens).toHaveProperty('get');
    expect(nameLens).toHaveProperty('set');
  });

  it('Getting and Setting property of an object using a lens.', () => {
    const user: User = { name: 'Lenon', age: 20 };

    const getName = (user: User) => user.name;
    const setName = (name: User['name']) => (data: User) => ({ ...data, name });
    const nameLens = lens(getName, setName);

    const getAge = (user: User) => user.age;
    const setAge = (age: User['age']) => (data: User) => ({ ...data, age });
    const ageLens = lens(getAge, setAge);

    expect(nameLens.get(user)).toEqual(user.name);
    expect(nameLens.set('Leon')(user).name).toEqual('Leon');

    expect(ageLens.get(user)).toEqual(user.age);
    expect(ageLens.set(54)(user).age).toEqual(54);
  });
});
