import parser from 'css';

/**
 * Use all kinds of rules to transform HTML file.
 */
class CssProcessor {
  constructor(doc) {
    this._doc = doc;
    this._ast = undefined;
    this._css = '';
    this._rules = [];
  }

  /**
   * Register a new rule
   *
   * @param {Object} rule
   * @return {CssProcessor}
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
   * @return {CssProcessor}
   */
  ast() {
    this._ast = this._ast || parser.parse(this._doc);
    return this;
  }

  /**
   * Transform the nodes that matched by rules, by using the tranform() function
   * defined in rules.
   *
   * @return {CssProcessor}
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
   * @return {CssProcessor}
   */
  serialize() {
    if (this._ast) {
      this._css = parser.stringify(this._ast);
    }

    return this;
  }

  /**
   * Output the html string
   *
   * @return {string}
   */
  toString() {
    return this._css;
  }
}

export default CssProcessor;
