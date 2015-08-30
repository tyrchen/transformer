import R from 'ramda';
import logger from './../utils/logger';
import {fileConcat, redisConcat} from './../utils/concat';

function getEmptyNode(parent) {
  return {
    nodeName: '#text',
    value: '',
    parentNode: parent,
  };
}

const nodeOps = {
  css: {
    getUrl: (item) => {
      const href = R.find(R.propEq('name', 'href'))(item.node.attrs);
      if (href && href.value) {
        return href.value;
      }

      return undefined;
    },

    getNode: (parent, filename) => {
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

    getEmptyNode: getEmptyNode,
  },
  js: {
    getUrl: (item) => {
      const href = R.find(R.propEq('name', 'src'))(item.node.attrs);
      if (href && href.value) {
        return href.value;
      }

      return undefined;
    },

    getNode: (parent, filename) => {
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

    getEmptyNode: getEmptyNode,
  },
};

export function fileAdapter(name) {
  return {
    name: name,
    func: (dataList, cb) => {
      logger.info(`Concat files ${dataList} to ${name} with fileAdapter.`);
      fileConcat(dataList, name, cb);
    },
  };
}

export function redisAdapter(name) {
  return {
    name: name,
    func: (dataList, cb) => {
      logger.info(`Concat files ${dataList} to ${name} with redisAdapter.`);
      redisConcat(dataList, name, cb);
    },
  };
}

export function combineNodes(type, concat) {
  return function(items) {
    let urls = [];
    const {getUrl, getNode, getEmptyNode} = nodeOps[type];
    items.forEach(item => {
      let url = getUrl(item);

      if (url) {
        urls.push(url);
      } else {
        logger.info('Cannot find a URL from item attrs:', item.node.attrs);
      }

      // turn the node to a empty text node
      item.node.parentNode.childNodes[item.index] = getEmptyNode(item.node.parentNode);
    });

    const {name, func} = concat;
    func(urls, (...args) => logger.info(args));

    let parent = items[0].node.parentNode;
    parent.childNodes.push(getNode(parent, name));
  };
}
