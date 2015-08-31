import R from 'ramda';
import logger from './../utils/logger';
import {combineNodes, fileAdapter} from './common';

export function jsNameChangeRule(name) {
  return {
    name: 'jsNameChangeRule',
    filters: [],
    results: [],
    transform: undefined,
  };
}
