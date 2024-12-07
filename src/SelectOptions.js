import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function SelectOptions({ setStudySet, setQuizOptions, data }) {
  const { tag } = useParams();
  const [quizOptionsT, setQuizOptionsT] = useState([]);

  // if data is empty, go back to the main page
  if (data === undefined || data.length === 0) {
    window.location.href = '/';
  }
  else {
    //console.log(data);
  }

  React.useEffect(() => {
    // Perform state updates here
    setStudySet(data); // Replace newStudySetData with your actual data
  }, [data, setStudySet]);

  // find which column the tag is in
  // TODO: instead of assuming a single tag, accept an array of tags
  let tagIndex = -1;
  for (let i = 0; i < data[0].length; i++) {
    if (data[0][i] === 'tags') {
      tagIndex = i;
      break;
    }
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

  // include the header row of the data
  taggedData.unshift(data[0]);

  let quizOptions = [];

  const handleCheckboxChange = (header, type) => {
    quizOptions = quizOptionsT;
    if (type === "none") {
      quizOptions = quizOptions.filter(option => option[0] !== header);
    }
    else {
      quizOptions = quizOptions.filter(option => option[0] !== header);
      quizOptions.push([header, type]);
    }
    if (quizOptions.includes('include partials') === false) {
      quizOptions.push('include partials');
    }
    //console.log(quizOptions);
    setQuizOptionsT(quizOptions);
    setQuizOptions(quizOptions);
  };

  const [isQuizReady, setIsQuizReady] = useState(false);

  const checkQuizReady = React.useCallback(() => {
    const frontSelected = quizOptionsT.filter(option => option[1] === 'front').length === 1;
    const backSelected = quizOptionsT.filter(option => option[1] === 'back').length === 1;
    setIsQuizReady(frontSelected && backSelected);
  }, [quizOptionsT]);
  
  // useEffect to check if quiz is ready whenever quizOptionsT changes
  React.useEffect(() => {
    checkQuizReady();
  }, [quizOptionsT, checkQuizReady]);

  return (
    <div>
      <h1>Tag: {tag}</h1>
      <Link to={`/quiz/${tag}`} disabled={!isQuizReady}>
        <button disabled={!isQuizReady} type="button">
          Start Quiz
        </button>
      </Link>
      <table className="table">
        <thead>
          <tr>
            {taggedData[0].map((header, index) => (
              <th key={index}>
                <fieldset id={`columnCheck${header}`} >
                  <input type="radio" id={`none${header}`} name={`columnCheck${header}`} value="none" onClick={() => handleCheckboxChange(header, "none")} />
                  <label htmlFor="none">None</label>
                  <input type="radio" id={`front${header}`} name={`columnCheck${header}`} value="front" onClick={() => handleCheckboxChange(header, "front")} />
                  <label htmlFor="front">Front</label>
                  <input type="radio" id={`back${header}`} name={`columnCheck${header}`} value="back" onClick={() => handleCheckboxChange(header, "back")} />
                  <label htmlFor="back">Back</label><br />
                </fieldset>
                <span style={{ minWidth: '26ch', display: 'inline-block' }}>{header}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {taggedData.slice(1).map((row, rowIndex) => (
            <tr key={`${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}, ${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SelectOptions;