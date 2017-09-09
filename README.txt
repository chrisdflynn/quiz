Chris Flynn
Quiz App
12/14/15

The purpose of this angularjs app is to take a data structure such as the one shown below  as an input and render an appropriate web form. Once the user answers the questions and hits "Submit" it should calculate and display the user's score. It should alert the user if they did not answer all of the questions.

The app should also prompt the user for their name before they begin. 

It should record the users score using cookies or local storage and display a ranked leaderboard.

var questions = [

  {
    kind: "choose_one",
    question_text: "What color is they sky?",
    answer_choices: ["red", "blue", "green", "yellow"],
    correct_answer: "blue"
  },

  {
    kind: "choose_many",
    question_text: "What color are apples?",
    answer_choices: ["red", "blue", "green", "yellow", "purple"],
    correct_answers: ["red", "green", "yellow"],
  },

  {
    kind: "free_text",
    question_text: "What color is the ocean?",
    correct_answers: ["blue"]
  },
];


