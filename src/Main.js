import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { Link } from 'react-router-dom';

//TODO: Replace clicking on tag links with checkboxes to the left of the tags, and a button to submit the selected tags to the next page

function Main({setStudySet, studySet}) {
  const [tags, setTags] = useState([]);
  const [tagData, setTagData] = useState([]);

  const handleFileLoad = (data) => {
    setStudySet(data);
    // data will always be a 3D array
    // data[0] will always be an array of headers
    // data[1+] will always be an array of rows
    // first, find the column index of the tags
    let tagIndex = -1;
    for (let i = 0; i < data[0].length; i++) {
      if (data[0][i] === 'tags') {
        tagIndex = i;
        break;
      }
    }

    // next, extract the tags from each row
    let tags = [];
    let tagData = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][tagIndex] === undefined) {
        continue;
      }
      // if any row has an empty tag, replace it with 'No_Tags'
      if (data[i][tagIndex] === '') {
        data[i][tagIndex] = 'No_Tags';
      }
      let elmTags = data[i][tagIndex].split(" ");
      //console.log(elmTags);
      for (let elmTag of elmTags) { // split by space
        // if the tags column is empty, or is already present, skip
        if (elmTag === '' || elmTag === undefined) {
          continue;
        }
        if (tags.includes(elmTag)) {
          let index = tags.indexOf(elmTag);
          tagData[index][1] += 1;
          continue;
        }
        // console.log(elmTag);
        tags = tags.concat(elmTag);
        tagData.push([elmTag, 1, `${data[i].slice(0, data[i].length-1).join(', ')}`]);
      }
    }

    // console.log(tags);

    setTags(tags);
    setTagData(tagData);

  };

  // if studySet isn't empty but tags is, then we need to load the data
  if (studySet !== undefined && studySet.length !== 0 && tags.length === 0) {
    handleFileLoad(studySet);
  }

  return (
      <div className="container mt-5">
      <CSVReader onFileLoaded={handleFileLoad} />
      <table className="table table-striped table-bordered mt-3">
        <thead className="thead-dark">
        <tr>
          <th>tags</th>
          <th># of Elements</th>
          <th>Example Data</th>
        </tr>
        </thead>
        <tbody>
        {tags.map((cell, rowIndex) => (
          <tr key={rowIndex}>
            <td>
              <Link to={`/tag/${cell}`}>{cell}</Link>
            </td>
            <td>
              {tagData[rowIndex][1]}
            </td>
            <td>
              {tagData[rowIndex][2]}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default Main;