import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState } from 'react';
import SelectOptions from './SelectOptions';
import Main from './Main';
import Quiz from './Quiz';
import QuizResults from './QuizResults';

function App() {
  const [studySet, setStudySet] = useState([]);
  const [quizOptions, setQuizOptions] = useState([]);
  const [Answers, SetAnswers] = useState({});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Main setStudySet={setStudySet} studySet={studySet}/>} />
        <Route path="tag/:tag" element={<SelectOptions setQuizOptions={setQuizOptions} setStudySet={setStudySet} data={studySet}/>} />
        <Route path="quiz/:tag" element={<Quiz data={studySet} quizOptions={quizOptions} SetAnswers={SetAnswers}/>} />
        <Route path="results/:tag" element={<QuizResults data={studySet} quizOptions={quizOptions} Answers={Answers}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;