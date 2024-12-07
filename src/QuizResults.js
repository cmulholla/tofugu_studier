import React/*, { useState }*/ from 'react';
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

const styles = `
  td.correct {
    border-color: #a3e4a1;
    background-color: #a3e4a1;
  }
  td.incorrect {
    border-color: #ff9999;
    background-color: #ff9999;
  }
`;

function QuizResults({ data, quizOptions, Answers}) {

  const { tag } = useParams();

  // for now, print out everything in data, quizOptions, and Answers to the console
  //console.log(data);
  //console.log(quizOptions);
  console.log(Answers);

  const punctuation = /[.,/#!$%^&*;:{}=\-_`~()'"・、。！？「」『』（）［］｛｝〈〉《》【】〔〕]/g;

  // check if the user's answer is correct, using the quizOptions
  function checkAnswer(userAnswer, realAnswer) {
    if (userAnswer === undefined || userAnswer === "") {
      return false;
    }
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

  // if data is empty, go back to the main page
  if (data === undefined || data.length === 0) {
    window.location.href = '/';
    console.log(data);
  }
  else {
    //console.log(data);
  }

  // find which column is the front and back
  let colFront = "";
  let colBack = "";
  for (let i = 0; i < quizOptions.length; i++) {
    //console.log(quizOptions[i][0], quizOptions[i][1]);
    if (quizOptions[i][1] === 'front') {
      colFront = quizOptions[i][0];
    }
    if (quizOptions[i][1] === 'back') {
      colBack = quizOptions[i][0];
    }
  }

  // find which column the tag is in
  // find which column the user decided the front and back are in
  let frontIndex = -1;
  let backIndex = -1;
  let tagIndex = -1;
  // TODO: instead of assuming a single tag, accept an array of tags
  for (let i = 0; i < data[0].length; i++) {
    //console.log(data[0][i], colFront, colBack);
    if (data[0][i] === 'tags') {
      tagIndex = i;
    }
    if (data[0][i] === colFront) {
      frontIndex = i;
    }
    if (data[0][i] === colBack) {
      backIndex = i;
    }
  }

  // if the front or back column is missing, go back to the main page
  if (frontIndex === -1 || backIndex === -1) {
    window.location.href = '/';
    console.log(quizOptions);
    console.log(colFront, colBack);
  }

  // find the rows in the tag column that contain the tag, and store them in taggedData
  // TODO: instead of assuming a single tag, accept an array of tags
  let taggedData = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][tagIndex] === undefined) {
      continue;
    }
    // if any row has an empty cell in the frontIndex or backIndex, skip
    if (data[i][frontIndex].replace(" ", "") === '' || data[i][backIndex].replace(" ", "") === '') {
      continue;
    }
    let elmTags = data[i][tagIndex].split(" ");
    if (elmTags.includes(tag)) {
      taggedData.push(data[i]);
    }
  }

  // Caculate the results of the quiz
  let percentage = 0;
  let numCorrect = 0;
  let numTotal = 0;

  // create a table, where the first column is the front, the second column is the back, the third column is the user's answer, and the fourth column is whether the user's answer is correct
  // if the user's answer is correct, the fourth column should be green, otherwise it should be red
  // if the user didn't answer, the fourth column should be white
  let results = [];
  for (let i = 0; i < taggedData.length; i++) {
    let realAnswer = taggedData[i][backIndex];
    let userAnswer = Answers[taggedData[i][frontIndex]] !== undefined ? Answers[taggedData[i][frontIndex]][1] : "";

    if (userAnswer === undefined) {
      userAnswer = "";
    }

    console.log(userAnswer, realAnswer)

    let isCorrect = checkAnswer(userAnswer, realAnswer);
    let correctClass = "notAnswered";

    if (isCorrect) {
      correctClass = "correct";
      // increment numCorrect to calculate final score
      numCorrect++;
    }
    else if (userAnswer !== undefined) {
      correctClass = "incorrect";
    }

    // increment numTotal to calculate final score
    numTotal++;

    results.push([taggedData[i][frontIndex], taggedData[i][backIndex], userAnswer, correctClass]);
  }

  percentage = numTotal === 0 ? 0 : Math.round(numCorrect / numTotal * 100);

  return (
    <div>
      <style href={"stylesheet"} precedence="medium">
          {styles}
      </style>
      <h1>Quiz Results:</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3 style={{ marginRight: '5px' }}>{tag}: {numCorrect} out of {numTotal} ({percentage}%)</h3>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Qustion</th>
            <th>Answer</th>
            <th>User's Answer</th>
            <th>Correct?</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result[0]}</td>
              <td>{result[1]}</td>
              <td>{result[2]}</td>
              <td className={result[3]}>{result[3]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default QuizResults;