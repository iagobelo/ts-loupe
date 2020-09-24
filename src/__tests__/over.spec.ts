import over from '../over';
import prop from '../prop';

describe('lensSet', () => {
  type User = { name: string };

  it('Set a object propertie from a given lens using over()', () => {
    const user: User = { name: 'Santino' };
    const nameLens = prop<User>('name');
    const newName = "Santino D'Antonio";
    const userWithNewName = over(nameLens)(name => `${name} D'Antonio`)(user);

    expect(userWithNewName.name).toEqual(newName);
  });
});
