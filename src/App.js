import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState } from 'react';
import SelectOptions from './SelectOptions';
import Main from './Main';
import Quiz from './Quiz';

function App() {
  const [studySet, setStudySet] = useState([]);
  const [quizOptions, setQuizOptions] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Main setStudySet={setStudySet} studySet={studySet}/>} />
        <Route path="tag/:tag" element={<SelectOptions setQuizOptions={setQuizOptions} setStudySet={setStudySet} data={studySet}/>} />
        <Route path="quiz/:tag" element={<Quiz data={studySet} quizOptions={quizOptions}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;