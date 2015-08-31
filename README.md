# transformer

This is a study project for analyzing web resources and do transformations by rules. Uses cases include but not limited to:

* combine all the css files into one, including inline css written inside ``<style />``.
* combine all the js files into one, including inline js written inside ``<script />``.
* Change name/class of DOM elements and make sure corresponding css/js rules/expressions got changed.
* ...

To do above jobs we need to build AST for html, css and javascript. Thanks to __parse5__, __css__, and __esprima__ (__escodegen__), this could be achieved easily.

The whole project is written in ES6. Which means you probably need ``babel-node`` to run it.

## Demo

Please go to ``example`` folder, run:

```
$ npm install
$ npm install -g babel-node # if you haven't do so
$ npm start # or babel-node index.js
```

You will see from console output that ``index.html`` is transformed, removing any inline css/js code, and combining all the css/js resources into one file (generated.css/generated.js).

## Status

This project is in its init state. Tons of features haven't been finished. The code itself is unstable. Do not use it in your production environment.
