import parse5, {Parser} from 'parse5';
import R from 'ramda';
import Joi from 'joi';
import logger from './utils/logger';

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
    const f = R.allPass(rule.filters);
    return function(n, idx) {
      if (f(n)) {
        rule.results.push({node: n, index: idx});
      }
    };
  });

  traverse(node, middlewares);

  rules.forEach(rule => rule.transform(rule.results));
  return rules;
}

class HtmlProcessor {
  constructor(doc) {
    this._doc = doc;
    this._parser = new Parser();
    this._document = undefined;
    this._html = '';
    this._serializer = new parse5.Serializer();
    this._rules = [];
  }

  use(rule) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      filters: Joi.array().items(Joi.func()).required(),
      results: Joi.array().required(),
      transform: Joi.func().required(),
    });

    Joi.validate(rule, schema, (err, value) => {
      if (err) {
        logger.error(err, value);
      }
    });

    this._rules.push(rule);
    return this;
  }

  ast() {
    this._document = this._document || this._parser.parse(this._doc);
    return this;
  }

  transform() {
    logger.debug('transform() get called.');
    if (!this._document) {
      logger.info('Please call ast() to generate AST first.');
      return this;
    }

    if (!this._rules.length) {
      logger.info('Nothing to transform. You have not defined rules by using use().');
      return this;
    }

    findNode(this._document, this._rules);

    return this;
  }

  serialize() {
    if (this._document) {
      this._html = this._serializer.serialize(this._document);
    }

    return this;
  }

  toString() {
    return this._html;
  }
}

export default HtmlProcessor;

