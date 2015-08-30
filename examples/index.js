import R from 'ramda';

import {HtmlProcessor, CssProcessor} from './../lib/processors';
import logger from './../lib/utils/logger';
import {cssCombinator, jsCombinator} from './../lib/rules';

let htmlDoc = `
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/bootstrap-theme.min.css">
  <link rel="stylesheet" href="css/app.css">
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
  <script src="js/bootstrap.min.js"></script>
  <script src="js/app.js"></script>
  <script>
    $(document).ready(function() {
      $('#login').on('click', function(e) {
        var email = document.getElementById('email');
        var gid = document.getElementById;
        console.log('Email is ' + email.value);
        console.log($('#password').val());
        console.log($('input[name="rememberMe"]').val());
        console.log(gid('exampleInputFile'));
      });
    });
  </script>
</body>
</html>
`;

let cssDoc = `
#email {
  font-size: 110%;
}

input[name*="remember"] {
  font-weight: bold;
}
`

let htmlProcessor = new HtmlProcessor(htmlDoc);

htmlProcessor
  .use(cssCombinator('css/generated.css'))
  .use(jsCombinator('js/generated.js'))
  .ast()
  .transform()
  .serialize();

logger.info(htmlProcessor.toString());

let cssProcessor = new CssProcessor(cssDoc);

cssProcessor.ast().serialize()

logger.info(cssProcessor._ast, cssProcessor.toString())