import R from 'ramda';
import {combineNodes, fileAdapter} from './common';

/**
 * Rule to combine all styles together
 *
 * When combining styles, we need to process all <link rel='stylesheet' .../> and <style/>
 * nodes.
 *
 * @param {string} name
 * @return {{name: string, filters: *[], results: Array, transform: Function}}
 */
export function combineCssRule(name) {
  return {
    name: 'combineCSS',
    filters: [
      [x => x.nodeName === 'link', x => R.contains({ name: 'rel', value: 'stylesheet' }, x.attrs)],
      [x => x.nodeName === 'style'],
    ],
    results: [],
    transform: combineNodes('css', fileAdapter(name)),
  };
}

/**
 * Rules to combile all javascripts together, including inline javascript
 *
 * @param name
 * @return {{name: string, filters: *[], results: Array, transform: Function}}
 */
export function combineJsRule(name) {
  return {
    name: 'combineJS',
    filters: [
      x => x.nodeName === 'script',
    ],
    results: [],
    transform: combineNodes('js', fileAdapter(name)),
  };
}
