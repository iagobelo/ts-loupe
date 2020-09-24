import compose from '../compose';
import lensProp from '../prop';

describe('lensProp', () => {
  type User = {
    pocket: {
      money: number;
    };
  };

  it('Get and set a object propertie from a given lens created using prop()', () => {
    const user = {
      pocket: {
        money: 3213
      }
    };

    const pocketLens = lensProp<User>('pocket');
    const moneyLens = lensProp<User['pocket']>('money');

    const userMoneyLens = compose(
      pocketLens,
      moneyLens
    );

    const newUser = userMoneyLens.set(1000)({
      pocket: {
        money: 3213
      }
    });

    expect(userMoneyLens.get(user)).toEqual(user.pocket.money);
    expect(newUser.pocket).toEqual({ money: 1000 });
  });
});
