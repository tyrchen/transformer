import HtmlProcessor from './lib/HtmlProcessor';
import logger from './lib/utils/logger';
import R from 'ramda';

let doc = `
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
  <link rel="stylesheet" href="/css/bootstrap.min.css">
  <link rel="stylesheet" href="/css/bootstrap-theme.min.css">
  <link rel="stylesheet" href="/css/app.css">
</head>
<body>
<h1> Hello world!</h1>
  <form action="/app/post" method="post">
    <div class="form-group">
      <label for="email">Email address</label>
      <input type="email" class="form-control" name="email" id="email" placeholder="Email">
    </div>
    <div class="form-group">
      <label for="passowrd">Password</label>
      <input type="password" class="form-control" name="password" id="passowrd" placeholder="Password">
    </div>
    <div class="form-group">
      <label for="exampleInputFile">File input</label>
      <input type="file" id="exampleInputFile">
      <p class="help-block">Example block-level help text here.</p>
    </div>
    <div class="checkbox">
      <label>
        <input type="checkbox" id="remember" name="rememberMe"> Remember Me
      </label>
    </div>
    <button type="submit" class="btn btn-default" id="login">Submit</button>
  </form>
  <script src="/js/bootstrap.min.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>
`;

let htmlProcessor = new HtmlProcessor(doc);

htmlProcessor
  .use({
    name: 'combineCSS',
    filters: [
        x => x.nodeName === 'link',
        x => R.contains({ name: 'rel', value: 'stylesheet' }, x.attrs),
    ],
    results: [],
    transform: items => {
      R.map(item => {
        item.node.parentNode.childNodes[item.index] = {
          nodeName: '#text',
          value: '',
          parentNode: item.node.parentNode,
        };
      }, items);

      items[0].node.parentNode.childNodes.push({
        nodeName: 'link',
        tagName: 'link',
        attrs: [{ name: 'rel', value: 'stylesheet' },
          { name: 'href', value: '/css/generated.css' }],
        namespaceURI: 'http://www.w3.org/1999/xhtml',
        childNodes: [],
        parentNode: items[0].node.parentNode,
      });
    },
  })
  .ast()
  .transform()
  .serialize();

logger.info(htmlProcessor.toString())
