// public/core.js
var emerilsFood = angular.module('emerilsFood', []);
   
function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/food')
        .success(function(data) {
            $scope.foods = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createFood = function() {
        $http.post('/api/food', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.foods = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
   


    // delete a todo after checking it
    
    $scope.deleteFood = function(id) {
        $http.delete('/api/food/' + id)
            .success(function(data) {
                $scope.foods = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    ///api/total
    $scope.total = function(){
    	var total = 0;
	    for(var i = 0; i < $scope.foods.length; i++){
	        var product = $scope.foods[i];
	        if(product.food_price&&product.food_quantity)
	        	total += (product.food_price * product.food_quantity);
	    }
	    return total*0.925;
    }
    
}