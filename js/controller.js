var app = angular.module('quizApp', []);

app.controller('QuizController', ['$scope', '$http', '$sce', function($scope, $http, $sce){

	// Load JSON quiz data
	$http.get('js/data.json').then(function(quizData){
		$scope.questions = quizData.data;
	});

	// Init previous results from localStorage 
	$scope.userResponses = {};
	$scope.results = [];
	local = localStorage.getItem('results');
	if(local){
		$scope.results = local.replace(/[\[\]"]+/g, '').split(',');	// regex removes the brackets and double quotes	
	}
	
	// Init visibility of login and quiz divs
	$scope.loginDisplay = "enabled";
	$scope.quizDisplay  = "disabled";

	$scope.login = function(){
		// If the user does not enter their name,
		// they are gently reminded
		if($scope.usernameInput.text.trim() != undefined){
			$scope.username = $scope.usernameInput.text;
			$scope.loginDisplay = "disabled";
			$scope.quizDisplay  = "enabled";
		} else{
			alert('Please enter your name!!!');
		}
	}

	// Quiz sumitted, check results, score user, post results to localStorage
	$scope.submit = function(){

		$scope.numCorrect = 0;

		//First count the user responses to ensure all questions were answered
		userResponsesCount = 0;
		angular.forEach($scope.userResponses, function(userValue, userKey) {
			userResponsesCount++;
		});

		// If the user hasn't answered all the questions, alert them
		if(userResponsesCount < $scope.questions.length){
			alert("Please answer all the questions!!");
		}else{

			angular.forEach($scope.userResponses, function(value, key) {
				// Handle checking answers differently for each question "kind"
				switch($scope.questions[key].kind) {
					case "choose_one":
						// Simple string comparison here
				    	if($scope.questions[key].correct_answer == value){
				    		$scope.numCorrect += 1;
				    	}
				        break;
				    default:
				    	// Since choose_many's and free_text's correct_answers are arrays
				    	// we'll propagate through them the same way
				    	correct_answer_count = 0;
				    	incorrect_answer_count = 0;

				    	switch($scope.questions[key].kind){
				    		// choose_many user answers are in an array
				    		case "choose_many":
				    			// Loop through all the user selected choices
					    		angular.forEach(value, function(user_repsonse_value, user_repsonse_key){
					    			if(user_repsonse_value == true){
					    				// If the selected choice exists in the answer_choices array
					    				// increment the correct answer count
					    				// otherwise increment the incorrect answer count
					    				if($scope.questions[key].correct_answers.indexOf(user_repsonse_key) > -1){
					    					correct_answer_count += 1;
					    				}else{
					    					incorrect_answer_count += 1;
					    				}
					    			}
					    		});
					    		break;

				    		case "free_text":
				    			// free_text is a string that we can check against the possible answer_choices array
				    			if($scope.questions[key].correct_answers.indexOf(value) > -1){
			    					correct_answer_count += 1;
				    			}else{
				    				incorrect_answer_count += 1;
				    			}
				    			break;
				    	}

			    		// If there are any incorrect answers selected, the question is incorrect
			    		if(incorrect_answer_count==0){
			    			// If the correct answer count doesnt equal the amount of correct answer_choices from th JSON object,
			    			// then the user didnt select enough answer choices to get the whole question correct
			    			if(correct_answer_count == $scope.questions[key].correct_answers.length){
			    				$scope.numCorrect += 1;
			    			}
			    		}
				        break;
			    }
			});
			// Set remediation text
			if($scope.numCorrect == $scope.questions.length){
				remediation = "Congratulations!!! "+$scope.username+" answered all the questions correctly!!!";	
			}else{
				remediation = $scope.username + " answered "+$scope.numCorrect+" out of "+$scope.questions.length+" questions correctly.";
			}
			// Add latest result to results array
			$scope.results.unshift(remediation);

			// Save array to localStorage
			localStorage.setItem('results', JSON.stringify($scope.results));
		}
		 
	}

}]);