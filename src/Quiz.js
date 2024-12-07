import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import QuizNode from './QuizNode';
//import { Link } from 'react-router-dom';

const styles = `
  div {
    border: 2px solid;
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
  }
  textarea {
    min-width: 20ch;
    min-height: 2ch;
  }
  div.correct {
    border: 2px solid;
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
    border-color: #52d327;
  }
  div.incorrect {
    border: 2px solid;
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
    border-color: #ff4d4d;
  }
  textarea.correct {
    min-width: 20ch;
    min-height: 2ch;
    border-color: #52d327;
  }
  quizNode {
    display: inline-block;
    margin: 10px; /* Optional: Add some margin for spacing */
  }
`;

function Quiz({ data, quizOptions, SetAnswers }) {
  const { tag } = useParams();

  // Answers is a dictionary, where the key is the question, and the value is an array of [the real answer, the user's answer]
  const [ Answers ] = useState({});

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
    <>
      <style href={"stylesheet"} precedence="medium">
          {styles}
      </style>
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
      <Link to={`/results/${tag}`}>
        <button type="button">
          Finish Quiz
        </button>
      </Link>
    </>
  );
}

export default Quiz;