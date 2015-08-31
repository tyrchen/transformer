import R from 'ramda';

/**
 * recursively traverse a AST tree for matches
 *
 * @param {Object} entry
 * @param {Array} middlewares
 */
function traverse(entry, middlewares) {
  if (!entry.childNodes) return;

  entry.childNodes.forEach((item, idx) => {
    middlewares.forEach(middleware => {
      middleware.apply(this, [item, idx]);
    });

    traverse(item, middlewares);
  });
}

/**
 * find node in the AST and return matched nodes to each rule
 *
 * Each rule shall look like this:
 * {
 *   name: 'rule-name',
 *   filters: [...a set of filter]
 *   results: [...an empty mutable array]
 *   transform: function
 * }
 *
 * ATTENTION: this function will mutate rules passed in.
 *
 * @param {Object} node
 * @param {Array} rules
 * @return {Array}
 */
function findNode(node, rules) {
  const middlewares = rules.map(rule => {
    const filters = rule.filters;
    let f;
    if (Array.isArray(filters[0])) {
      const funcs = filters.map(items => R.allPass(items));
      f = R.anyPass(funcs);
    } else {
      f = R.allPass(filters);
    }

    return function(n, idx) {
      if (f(n)) rule.results.push({node: n, index: idx});
    };
  });

  traverse(node, middlewares);

  rules.forEach(rule => rule.transform(rule.results));
  return rules;
}

export default findNode;
