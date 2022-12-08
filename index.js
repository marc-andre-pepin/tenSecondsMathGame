$(document).ready(function(){

    var currentQuestion;
    var interval;
    var timeLeft = 10;
    var score = 0;
    var maxScore = 50;
    var maxOperand = 10;
    var maxTime = 10;

    var randomNumberGenerator = function (size) {
        return Math.ceil(Math.random() * size);
    }

    var questionGenerator = function () {
        var question = {};
        var num1 = randomNumberGenerator(maxOperand);
        var num2 = randomNumberGenerator(maxOperand);

        question.answer = num1 + num2;
        question.equation = String(num1) + " + " + String(num2);

        return question;
    }

    currentQuestion = questionGenerator();

    $('#equation').text(currentQuestion.equation);

    var renderNewQuestion = function () {
        currentQuestion = questionGenerator();
        $('#equation').text(currentQuestion.equation);
    }

    var checkAnswer = function (userInput, answer) {
        if(userInput === answer) {
            renderNewQuestion();
            $('#user-input').val('');
            updateTimeLeft(+1);
            updateScore(+1);
        }
    }

    var updateTimeLeft = function (amount) {
        timeLeft += amount;
        if(timeLeft > maxTime) {
            timeLeft = maxTime
        }
        $('#time-left').text(timeLeft);
        $('#time-left-label').text(timeLeft === 1 ? 'second left' : 'seconds left');
    }

    var startGame = function () {
        if (!interval) {
            if (timeLeft === 0) {
                updateTimeLeft(maxTime);
                updateScore(-score);
            }
            interval = setInterval(function () {
                updateTimeLeft(-1);
                if (timeLeft === 0) {
                    endGame();
                }
            }, 1000);
        }
    }

    var endGame = function () {
        clearInterval(interval);
        interval = undefined;
        $('#user-input').prop('disabled', true);
        $('#time-left').text(score >= maxScore ? 'Amazing!' : 'Time\'s up!');
        $('#time-left-label').text(score >= maxScore ? 'You reached 50!' : `Your score was ${score}`);
    }

    var updateScore = function (amount) {
        score += amount;
        $('#score').text(score);
        if(score >= maxScore) {
            endGame();
        }
    };

    $('#user-input').on('keyup', function () {
        startGame();
        checkAnswer(Number($(this).val()), currentQuestion.answer);
    });

    renderNewQuestion();

});
