import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

function SelectOptions({ setStudySet, setQuizOptions, data }) {
  const { tag } = useParams();

  // if data is empty, go back to the main page
  if (data === undefined || data.length < 3) {
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

  const [quizOptionsT, setQuizOptionsT] = useState([
    [data[0][0], 'front'],
    [data[0][1], 'back'],
    'include partials', 'ignore punctuation'
  ]);
  setQuizOptions(quizOptionsT);

  
  const [selectedOptions, setSelectedOptions] = useState(
    taggedData[0].reduce((acc, header, index) => {
      acc[header] = index === 0 ? 'front' : index === 1 ? 'back' : 'none';
      return acc;
    }, {})
  );

  const handleCheckboxChange = (header, type) => {
    setSelectedOptions((prevOptions) => {
      const newOptions = { ...prevOptions };

      // Reset other options with the same type to 'none'
      Object.keys(newOptions).forEach((key) => {
        if (newOptions[key] === type) {
          newOptions[key] = 'none';
        }
      });

      // Set the selected option for the current header
      newOptions[header] = type;
      console.log(newOptions)

      return newOptions;
    });
  };

  React.useEffect(() => {
    // set quizOptions to selectedOptions
    let quizOptions = Object.entries(selectedOptions).map(([header, type]) => {
      if (type !== 'none') {
        return [header, type];
      }
      return undefined;
    }).filter(option => option !== undefined);
    
    if (quizOptions.includes('include partials') === false) {
      quizOptions.push('include partials');
    }
    if (quizOptions.includes('ignore punctuation') === false) {
      quizOptions.push('ignore punctuation');
    }
    //console.log(quizOptions);
    setQuizOptionsT(quizOptions);
    setQuizOptions(quizOptions);
  }, [selectedOptions, setQuizOptions, setQuizOptionsT]);

  const [isQuizReady, setIsQuizReady] = useState(true);

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ marginRight: '10px' }}>Tag: {tag}</h1>
        <Link to={`/quiz/${tag}`} disabled={!isQuizReady}>
          <button disabled={!isQuizReady} type="button">
            Start Quiz
          </button>
        </Link>
      </div>
      <Table striped bordered hover>
        <thead style={{ textAlign: 'center', verticalAlign: 'middle' }}>
          <tr>
            {taggedData[0].map((header, index) => (
              <th key={index} style={header === 'tags' ? { whiteSpace: 'nowrap', width: '1%' } : {}}>
                {header !== 'tags' ? (
                  <>
                    <ToggleButtonGroup
                      type="radio"
                      name={`columnCheck${header}`}
                      value={selectedOptions[header]}
                      onChange={(val) => handleCheckboxChange(header, val)}
                    >
                      <ToggleButton id={`none${header}`} value="none">
                        None
                      </ToggleButton>
                      <ToggleButton id={`front${header}`} value="front">
                        Question
                      </ToggleButton>
                      <ToggleButton id={`back${header}`} value="back">
                        Answer
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <br />
                  </>
                ) : null}
                <span style={{ minWidth: '26ch', display: 'inline-block' }}>{header}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {taggedData.slice(1).map((row, rowIndex) => (
            <tr key={`${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}, ${cellIndex}`} style={cellIndex === taggedData[0].length - 1 ? { whiteSpace: 'nowrap', width: '1%' } : {}}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SelectOptions;