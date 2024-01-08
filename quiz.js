let score = 0;

let questions = document.getElementsByClassName('quiz-question');

for(let i = 0; i < questions.length; i++) {
  questions[i].style.display = 'none';
}

// visa den första frågan
questions[0].style.display = 'block';

let currentQuestion = 0;

let nextButton = document.getElementById('next');

function updateAnswerButtons() {
  let answerButtons = document.getElementsByClassName('answer');

  for(let i = 0; i < answerButtons.length; i++) {
    // rensa befintliga eventlyssnare
    let newButton = answerButtons[i].cloneNode(true);
    answerButtons[i].parentNode.replaceChild(newButton, answerButtons[i]);

    // lägg till en ny eventlyssnare
    newButton.addEventListener('click', function() {
      let resultDiv = document.getElementById('result');
      if (newButton.classList.contains('correct')) {
        resultDiv.innerText = 'Rätt svar!';
        score++; // öka poängen med 1
      } else {
        resultDiv.innerText = 'Fel svar!';
      }

      // uppdatera texten i poäng-elementet
      let scoreElement = document.getElementById('score');
      scoreElement.innerText = 'Poäng: ' + score;
    });
  }
}

nextButton.addEventListener('click', function() {
  console.log('Knappen klickades på!');
  // göm nuvarande fråga
  questions[currentQuestion].style.display = 'none';
  
  // gå till nästa fråga
  currentQuestion++;
  
  // visa nästa fråga, om det finns fler frågor
  if (currentQuestion < questions.length) {
    questions[currentQuestion].style.display = 'block';
    // uppdatera svarsknapparna för nästa fråga
    updateAnswerButtons();
  } else {
    let endText = document.getElementById('endText');
    endText.innerText = 'Grattis! nu kanske du känner mig lite bättre!';
  }
});

// uppdatera svarsknapparna för första frågan
updateAnswerButtons();


 


