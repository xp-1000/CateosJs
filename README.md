# CateosJs

CateosJs is an application which provide a video catalog player from several existent stockage sources. It use [MongoDB](http://www.mongodb.org/), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](http://angularjs.org/) based applications with [Mean](http://mean.io/).
## Prerequisites
* *MongoDB* - <a href="http://www.mongodb.org/downloads">Download</a> and Install mongodb - <a href="http://docs.mongodb.org/manual">Checkout their manual</a> if you're just starting.
* *Node.js* - <a href="http://nodejs.org/download/">Download</a> and Iמstall Node.js, codeschool has free <a href="https://www.codeschool.com/courses/real-time-web-with-node-js">node</a> and <a href="https://www.codeschool.com/courses/shaping-up-with-angular-js">angular</a> tutorials.
* *Git* - Get git using a package manager or <a href="http://git-scm.com/downloads">download</a> it.
* Grunt - Download and Install [Grunt](http://gruntjs.com).
```
$ npm install -g grunt-cli
```

## Installation
To start with CateosJs, only need install grunt and run npm install.

### Install Grunt

```bash
  $ sudo npm install -g grunt-cli
```

### Install Cateos
```bash
  $ cd CateosJs && npm install
```

### Run CateosJs
We recommend using [Grunt](https://github.com/gruntjs/grunt-cli) to start the server:
```bash
  $ grunt
```
If grunt aborts because of JSHINT errors, these can be overridden with the `force` flag:
```bash
  $ grunt -f
```
Alternatively, when not using `grunt` (and for production environments) you can run:
```bash
  $ node server
```
Then, open a browser and go to:
```bash
  http://localhost:3000
```

## License
We belive that mean should be free and easy to integrate within your existing projects so we chose the [The MIT License](http://opensource.org/licenses/MIT)



