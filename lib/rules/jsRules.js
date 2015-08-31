import R from 'ramda';
import logger from './../utils/logger';
import {combineNodes, fileAdapter} from './common';

/**
 * TODO: (tchen) this rule hasn't been finished
 *
 * @param {string} name
 * @return {{name: string, filters: Array, results: Array, transform: undefined}}
 */
export function jsNameChangeRule(name) {
  return {
    name: 'jsNameChangeRule',
    filters: [],
    results: [],
    transform: undefined,
  };
}
