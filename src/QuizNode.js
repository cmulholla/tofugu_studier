import React, { useState } from 'react';

const QuizNode = (({ Question, Answer, quizOptions, Answers, SetAnswers}) => {
  // if the user types in the answer and presses enter or clicks off, turn the question green if correct, red if incorrect
  // Answers is a dictionary, where the key is the question, and the value is an array of [the real answer, the user's answer]
  const [correctClass, setCorrectClass] = useState("notAnswered");

  const punctuation = /[.,/#!$%^&*;:{}=\-_`~()'"・、。！？「」『』（）［］｛｝〈〉《》【】〔〕]/g;

  // check if the user's answer is correct, using the quizOptions
  function checkAnswer(userAnswer, realAnswer) {
    if (userAnswer.toLowerCase() === realAnswer.toLowerCase() 
    || (quizOptions.includes('include partials') 
      && realAnswer.toLowerCase().includes(userAnswer.toLowerCase())
      )
    || (quizOptions.includes('ignore punctuation')
      && (realAnswer.toLowerCase().replace(punctuation, '') === userAnswer.toLowerCase().replace(punctuation, '')
      || realAnswer.toLowerCase().replace(punctuation, '').replace(/ /g, '') === userAnswer.toLowerCase().replace(punctuation, '').replace(/ /g, '')
      )
      )
    || (quizOptions.includes('ignore punctuation') && quizOptions.includes('include partials')
      && (realAnswer.toLowerCase().replace(punctuation, '').includes(userAnswer.toLowerCase().replace(punctuation, ''))
      || realAnswer.toLowerCase().replace(punctuation, '').replace(/ /g, '').includes(userAnswer.toLowerCase().replace(punctuation, '').replace(/ /g, ''))
      )
      )
    ) {
      return true;
    }
    console.log(realAnswer);
    console.log(realAnswer.toLowerCase().replace(punctuation, '').replace(' ', ''))
    console.log(userAnswer.toLowerCase().replace(punctuation, '').replace(/ /g, ''))
    return false;
  }

  //TODO: change the code to remove isCorrect, isIncorrect, and isAnswered, making everything depend on the correctClass. Have the default be "notAnswered", correct be "correct", and incorrect be "incorrect"
  const handleAnswer = (e) => {
    //console.log(Answer.toLowerCase().replace(punctuation, '').replace(' ', '') === e.target.value.toLowerCase().replace(punctuation, '').replace(' ', ''));
    if (e.key === 'Enter' && !e.shiftKey) {
      //console.log(quizOptions);
      if (e.target.value === '' || e.target.value === ' ') {
        // skip checking the answer if the user didn't type anything
        e.preventDefault();
      }
      else if (checkAnswer(e.target.value, Answer)) {
        setCorrectClass("correct");
      }
      else {
        setCorrectClass("incorrect");
      }

      // set the answer in the Answers dictionary
      if (Answers === undefined || Answers.length === 0) {
        Answers = { [Question]: [Answer, e.target.value] }
      }
      else if (Answers[Question] !== undefined) {
        Answers[Question][1] = e.target.value;
      }
      else {
        Answers[Question] = [Answer, e.target.value];
      }
      SetAnswers(Answers);

      // Find the next focusable element and move focus to it
      const focusableElements = 'button:not(:disabled), [href]:not([aria-disabled="true"]), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])';
      const elements = Array.prototype.slice.call(document.querySelectorAll(focusableElements));
      const index = elements.indexOf(document.activeElement);
      if (index > -1 && index < elements.length - 1) {
        elements[index + 1].focus();
      }
      e.preventDefault(); // Prevent default behavior of Enter key
    }
    else if (e.key === '?' && e.target.value.slice(-2) === 'qq') {
      e.preventDefault(); // Prevent default behavior of ? key
      alert(Answer);
    }
  };

  const handleBlur = (e) => {
    if (e.target.value === '' || e.target.value === ' ') {
      // skip checking the answer if the user didn't type anything
      e.preventDefault();
      return;
    }
    else if (checkAnswer(e.target.value, Answer)) {
      setCorrectClass("correct");
    }
    else {
      setCorrectClass("incorrect");
    }
    
    //console.log(Answers)
    // set the answer in the Answers dictionary
    if (Answers === undefined || Answers.length === 0) {
      Answers = { [Question]: [Answer, e.target.value] }
    }
    else if (Answers[Question] !== undefined) {
      Answers[Question][1] = e.target.value;
    }
    else {
      Answers[Question] = [Answer, e.target.value];
    }
    SetAnswers(Answers);
  }

  return (
    <label style={{display: 'inline-block', margin: '10px'}}>
      <div 
        class={correctClass}
      >
        <h1>{Question}</h1>
        <textarea
          class={correctClass}
          onKeyPress={handleAnswer}
          onBlur={handleBlur}
          disabled={correctClass === "correct"}
        />
        {/*<h2>{isCorrect ? "Correct!" : isIncorrect ? "Incorrect!" : ""}</h2>*/}
      </div>
    </label>
  );
});

export default QuizNode;