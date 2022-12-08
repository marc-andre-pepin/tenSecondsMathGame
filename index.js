$(document).ready(function () {

    var currentQuestion;
    var interval;
    var timeLeft = 10;
    var score = 0;
    var maxScore = 50;
    var maxTime = 10;
    var topScores = [];

    var randomNumberGenerator = function (size) {
        return Math.ceil(Math.random() * size);
    }

    var questionGenerator = function () {
        var question = {};
        const maxOperand = $('#maxNumber').val()
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
        if (userInput === answer) {
            renderNewQuestion();
            $('#user-input').val('');
            updateTimeLeft(+1);
            updateScore(+1);
        }
    }

    var updateTimeLeft = function (amount) {
        timeLeft += amount;
        if (timeLeft > maxTime) {
            timeLeft = maxTime
        }
        $('#time-left').text(timeLeft);
        $('#time-left-label').text(timeLeft === 1 ? 'second left' : 'seconds left');
    }

    var handleInput = function () {
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

    var startGame = function () {
        clearInterval(interval);
        interval = undefined;

        var userInput = $('#user-input')
        userInput.val('');
        userInput.prop('disabled', false);

        score = 0;
        $('#score').text(score);

        timeLeft = 10;
        $('#time-left').text(timeLeft);
        $('#time-left-label').text('seconds left');

        renderNewQuestion();
    }

    $('#startGame').click(startGame)

    var updateLeaderboard = function () {
        topScores.push(score);
        topScores.sort(function (a, b) {
            return b - a;
        });
        if (topScores.length > 5) {
            topScores.pop();
        }

        var leaderboard = $('#leaderboard');
        leaderboard.empty();
        for (var topScore of topScores) {
            var li = $(`<li>${topScore}</li>`);
            leaderboard.append(li);
        }
    }

    var endGame = function () {
        clearInterval(interval);
        interval = undefined;
        $('#user-input').prop('disabled', true);
        $('#time-left').text(score >= maxScore ? 'Amazing!' : 'Time\'s up!');
        $('#time-left-label').text(score >= maxScore ? 'You reached 50!' : `Your score was ${score}`);
        updateLeaderboard();
    }

    var updateScore = function (amount) {
        score += amount;
        $('#score').text(score);
        if (score >= maxScore) {
            endGame();
        }
    };

    $('#user-input').on('keyup', function () {
        handleInput();
        checkAnswer(Number($(this).val()), currentQuestion.answer);
    });

    renderNewQuestion();

});
