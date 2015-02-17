'use strict';
var express = require('express');
var feathers = require('feathers');
var mongodb = require('feathers-mongodb');
var hooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var app = express();


var todoService = mongodb({
    db: "todo-app",
    collection: "todos"
});



var server = feathers()
    .configure(feathers.rest())
    .configure(feathers.socketio())
    .configure(hooks())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .use('/todos', todoService);


// hooks can be used to massage data
function convertTodo (hook, next) {
    var old = hook.data;

    hook.data = {
		complete: (old.complete === 'true' || old.complete === true),
		text: old.text
    };
    next();
}


server.service('todos').before({
    create: convertTodo,
    update: convertTodo
});

server.listen(8090);

/* app.post('/', ); */
/* app.get('/', ); */