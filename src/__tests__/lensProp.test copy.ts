import compose from '../compose';
import lensProp from '../lensProp';

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

    const composedLens = compose(
      pocketLens,
      moneyLens
    );
  });
});
