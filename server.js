// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration ===============================================================
mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

//define model===================================================================
var Food = mongoose.model('food', {
        food_name : String,
        food_price : Number,
        food_quantity : Number,
        food_desc : String
    });


// routes ======================================================================
require('./app/routes.js')(app);

// api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/food', function(req, res) {

        // use mongoose to get all todos in the database
        Food.find(function(err, foods) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);
            res.json(foods); // return all todos in JSON format
        });
    });

     // create todo and send back all todos after creation
    app.post('/api/food', function(req, res) {
        if(req.body.food_name)
        {



        // create a todo, information comes from AJAX request from Angular
        Food.create({
            food_name : req.body.food_name,
            food_price:req.body.food_price,
            food_desc:req.body.food_desc,
            done : false
        }, function(err, food) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Food.find(function(err, foods) {
                if (err)
                    res.send(err);
                res.json(foods);
            });
        });
        }
        else
        {
            // get and return all the todos after you create another
            Food.find(function(err, foods) {
                if (err)
                    res.send(err);
                res.json(foods);
            });
        }

    });

    // delete a todo
    app.delete('/api/food/:food_id', function(req, res) {
        Food.remove({
            _id : req.params.food_id
        }, function(err, food) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Food.find(function(err, foods) {
                if (err)
                    res.send(err);
                res.json(foods);
            });
        });
    });
    // total
    // delete a todo
    app.get('/api/total', function($scope, $http) {
         
    });
   




// application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    

    });


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
