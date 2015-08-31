import esprima from 'esprima';
import escodegen from 'escodegen';

// TODO: (tchen) this file hasn't been finished.

/**
 * Use all kinds of rules to transform HTML file.
 */
class JsProcessor {
  constructor(doc) {
    this._doc = doc;
    this._ast = undefined;
    this._js = '';
    this._rules = [];
  }

  /**
   * Register a new rule
   *
   * @param {Object} rule
   * @return {JsProcessor}
   */
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
        throw err;
      }
    });

    this._rules.push(rule);
    return this;
  }

  /**
   * Generate AST for html file
   *
   * @return {JsProcessor}
   */
  ast() {
    this._ast = this._ast || esprima.parse(this._doc);
    return this;
  }

  /**
   * Transform the nodes that matched by rules, by using the tranform() function
   * defined in rules.
   *
   * @return {JsProcessor}
   */
  transform() {
    if (!this._ast) {
      logger.info('Please call ast() to generate AST first.');
      return this;
    }

    if (!this._rules.length) {
      logger.info('Nothing to transform. You have not defined rules by using use().');
      return this;
    }

    findNode(this._ast, this._rules);

    return this;
  }

  /**
   * Generate html string from the AST.
   *
   * @return {JsProcessor}
   */
  serialize() {
    if (this._ast) {
      this._js = escodegen.generate(this._ast);
    }

    return this;
  }

  /**
   * Output the html string
   *
   * @return {string}
   */
  toString() {
    return this._js;
  }
}

export default JsProcessor;
