import fs from 'fs';
import R from 'ramda';
import logger from './../utils/logger';
import {fileConcat, redisConcat} from './../utils/concat';

/**
 * Generate an empty '#text' node
 *
 * @param {Object} parent
 * @return {{nodeName: string, value: string, parentNode: Object}}
 */
function _getEmptyNode(parent) {
  return {
    nodeName: '#text',
    value: '',
    parentNode: parent,
  };
}

/**
 * Common operations
 */
const nodeOps = {
  css: {
    getUrl(item) {
      const href = R.find(R.propEq('name', 'href'))(item.node.attrs);
      if (href && href.value) {
        return href.value;
      }

      return undefined;
    },

    getNode(parent, filename) {
      return {
        nodeName: 'link',
        tagName: 'link',
        attrs: [
          { name: 'rel', value: 'stylesheet' },
          { name: 'href', value: filename },
        ],
        namespaceURI: 'http://www.w3.org/1999/xhtml',
        childNodes: [],
        parentNode: parent,
      };
    },

    getEmptyNode: _getEmptyNode,
  },
  js: {
    getUrl(item) {
      const href = R.find(R.propEq('name', 'src'))(item.node.attrs);
      if (href && href.value) {
        return href.value;
      }

      return undefined;
    },

    getNode(parent, filename) {
      return {
        nodeName: 'script',
        tagName: 'script',
        attrs: [
          { name: 'src', value: filename },
        ],
        namespaceURI: 'http://www.w3.org/1999/xhtml',
        childNodes: [],
        parentNode: parent,
      };
    },

    getEmptyNode: _getEmptyNode,
  },
};

/**
 * Concat the result of the promises then write to a file by the 'name'.
 *
 * @param {string} name
 * @return {{name: string, func: Function}}
 */
export function fileAdapter(name) {
  return {
    name: name,
    func: (promises, cb) => {
      logger.info(`Concat files ${promises} to ${name} with fileAdapter.`);
      fileConcat(promises, name, cb);
    },
  };
}

/**
 * Concat the result of the promises then write to redis key by the 'name'.
 *
 * @param {string} name
 * @return {{name: string, func: Function}}
 */
export function redisAdapter(name) {
  return {
    name: name,
    func: (dataList, cb) => {
      logger.info(`Concat files ${dataList} to ${name} with redisAdapter.`);
      redisConcat(dataList, name, cb);
    },
  };
}

/**
 * General purpose function for combining files identified by filters. There're urls
 * and inline code (e.g. <style /> <script />), thus to make an unified interface, we
 * use Promise to provide a clean abstraction.
 *
 * @param {string} type
 * @param {Object} concat
 * @return {Function}
 */
export function combineNodes(type, concat) {
  return function combine(items) {
    const results = [];
    const {getUrl, getNode, getEmptyNode} = nodeOps[type];
    items.forEach(item => {
      const url = getUrl(item);

      if (url) {
        results.push(new Promise((resolve, reject) => {
          // TODO: (tchen) we might need to initiate a http request to get file content
          fs.readFile(url, 'utf8', (err, data) => {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(data);
            }
          });
        }));
      } else {
        const childNodes = item.node.childNodes;
        if (childNodes.length) {
          const texts = R.pipe(R.filter(n => n.nodeName === '#text'), R.map(n => n.value))(childNodes);
          results.push(new Promise((resolve) => {
            resolve(texts.join(''));
          }));
        } else {
          logger.info('Cannot find a URL or text content from item:', item.node);
        }
      }

      // turn the node to a empty text node
      item.node.parentNode.childNodes[item.index] = getEmptyNode(item.node.parentNode);
    });

    const {name, func} = concat;
    func(results, err => err && logger.error(err));

    const parent = items[0].node.parentNode;
    parent.childNodes.push(getNode(parent, name));
  };
}
