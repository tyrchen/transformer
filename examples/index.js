import fs from 'fs';
import R from 'ramda';

import {HtmlProcessor, CssProcessor, JsProcessor} from './../lib/processors';
import logger from './../lib/utils/logger';
import {combineCssRule, combineJsRule} from './../lib/rules';

fs.readFile('./index.html', 'utf8', (err, data) => {
  err && logger.error(err);

  let htmlProcessor = new HtmlProcessor(data);

  htmlProcessor
    .use(combineCssRule('css/generated.css'))
    .use(combineJsRule('js/generated.js'))
    .ast()
    .transform()
    .serialize();

  logger.info(`Transformed index.html: ${htmlProcessor.toString().length}`);
  logger.info(htmlProcessor.toString());
});

fs.readFile('./css/app.css', 'utf8', (err, data) => {
  if (err) {
    logger.error(err);
  }

  let cssProcessor = new CssProcessor(data);

  cssProcessor.ast().serialize();
  logger.info(`Transformed css file: ${cssProcessor.toString().length}`);
});

fs.readFile('./js/app.js', 'utf8', (err, data) => {
  err && logger.error(err);

  let jsProcessor = new JsProcessor(data);

  jsProcessor.ast().serialize();
  logger.info(`Transformed js file: ${jsProcessor.toString().length}`);
});
