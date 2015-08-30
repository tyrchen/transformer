import R from 'ramda';
import logger from './../utils/logger';
import {combineNodes, fileAdapter} from './common';

function jsCombinator(name) {
  return {
    name: 'combineJS',
    filters: [
        x => x.nodeName === 'script',
    ],
    results: [],
    transform: combineNodes('js', fileAdapter(name)),
  };
};

export default jsCombinator;