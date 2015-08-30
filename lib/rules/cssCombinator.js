import R from 'ramda';
import fileConcat from './../utils/fileConcat';
import logger from './../utils/logger';

function cssCombinator(filename) {
  return {
    name: 'combineCSS',
    filters: [
      x => x.nodeName === 'link',
      x => R.contains({ name: 'rel', value: 'stylesheet' }, x.attrs),
    ],
    results: [],
    transform: items => {
      let filenames = [];
      items.forEach(item => {
        // get filenames

        const href = R.find(R.propEq('name', 'href'))(item.node.attrs);
        if (href && href.value) {
          filenames.push(href.value);
        } else {
          logger.info('Found a link stylesheet node which has no href:', item.node.attrs);
        }

        // turn the node to a empty text node
        item.node.parentNode.childNodes[item.index] = {
          nodeName: '#text',
          value: '',
          parentNode: item.node.parentNode,
        };
      });

      logger.info(`Concat files ${filenames} to ${filename}.`);
      fileConcat(filenames, filename, (...args) => logger.info(args));

      items[0].node.parentNode.childNodes.push({
        nodeName: 'link',
        tagName: 'link',
        attrs: [
          { name: 'rel', value: 'stylesheet' },
          { name: 'href', value: filename },
        ],
        namespaceURI: 'http://www.w3.org/1999/xhtml',
        childNodes: [],
        parentNode: items[0].node.parentNode,
      });
    },
  };
};

export default cssCombinator;