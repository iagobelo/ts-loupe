/*!
 * ts-loupe v0.1.1
 * (c) Iago Belo
 * Released under the MIT License.
 */
/**
 * Creates a lens from A to B given the getter and setter.
 * @param {Getter} getter - Implementation of a lens getter.
 * @param {Setter} setter - Implementation of a lens setter.
 */
var lens = function (getter, setter) { return ({
  get: getter,
  set: setter
}); };

/**
 * Sets the value using the given lens and returns the resulting structure.
 * @param lens - Lens that will be used to set the value.
 */
var set = function (lens) { return function (value) { return lens.set(value); }; };

/**
 * Applies the function to the given lens property and returns the result.
 * @param lens - Lens that will be used to get and set the resulting value.
 */
var over = function (lens) { return function (fn) { return function (data) { return lens.set(fn(lens.get(data)))(data); }; }; };

/**
 * Returns the property using the given lens.
 * @param lens - Lens to get (view) the property.
 */
var view = function (lens) { return lens.get; };

/**
 * Compose two lenses (`Lens<A, B>, Lens<B, C>`) to produce a new lens `Lens<A, C>`.
 * @param lenses
 */
var compose = function () {
  var lenses = [], len = arguments.length;
  while ( len-- ) lenses[ len ] = arguments[ len ];

  return ({
  get: function (a) { return lenses[1].get(lenses[0].get(a)); },
  set: function (c) { return function (a) { return lenses[0].set(lenses[1].set(c)(lenses[0].get(a)))(a); }; }
});
};

/**
 * Creates a lens focused on a given property.
 * @param key - Property to focus.
 */
var prop = function (key) { return ({
  get: function (data) { return data[key]; },
  set: function (value) { return function (data) {
    var obj;

    return Object.assign({}, data, ( obj = {}, obj[key] = value, obj ));
 }    }
}); };

export { compose, lens, over, prop, set, view };
//# sourceMappingURL=index.esm.js.map
