/**
 * TODO: (tchen) this rule hasn't been finished
 *
 * @param {string} name
 * @return {{name: string, filters: Array, results: Array, transform: undefined}}
 */
export function cssNameChangeRule(name) {
  return {
    name: 'cssNameChangeRule',
    filters: [],
    results: [],
    transform: name,
  };
}
