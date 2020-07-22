import compose from '../compose';
import lensProp from '../prop';

describe('lensProp', () => {
  type User = {
    pocket: {
      money: number;
    };
  };

  const user = {
    pocket: {
      money: 3213
    }
  };

  it('Get and set a object propertie from a given lens created using lensProp()', () => {
    const pocketLens = lensProp<User>('pocket');
    const moneyLens = lensProp<User['pocket']>('money');

    const userMoneyLens = compose(
      pocketLens,
      moneyLens
    );

    expect(userMoneyLens.get(user)).toEqual(user.pocket.money);
  });
});
