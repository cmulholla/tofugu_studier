import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import QuizNode from './QuizNode';
import './Quiz.css';
//import { Link } from 'react-router-dom';

function Quiz({ data, quizOptions }) {
  const { tag } = useParams();

  // Answers is a dictionary, where the key is the question, and the value is an array of [the real answer, the user's answer]
  const [ Answers, SetAnswers ] = useState({});

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
    let elmTags = data[i][tagIndex].split(" ");
    if (elmTags.includes(tag)) {
      taggedData.push(data[i]);
    }
  }

  return (
    <div>
      <h1>Quiz: {tag}</h1>
      {taggedData.map((row, index) => (
        <QuizNode
        key={index}
        Question={row[frontIndex]}
        Answer={row[backIndex]}
        quizOptions={quizOptions}
        Answers={Answers}
        SetAnswers={SetAnswers}
      />
      ))}
    </div>
  );
}

export default Quiz;