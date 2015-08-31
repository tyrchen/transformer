import R from 'ramda';
import logger from './../utils/logger';
import {combineNodes, fileAdapter} from './common';

export function nameChangeRule(name) {
  return {
    name: 'combineCSS',
    filters: [
        x => x.nodeName === 'link',
        x => R.contains({ name: 'rel', value: 'stylesheet' }, x.attrs),
    ],
    results: [],
    transform: combineNodes('css', fileAdapter(name)),
  };
}

