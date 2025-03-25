import { useState, useEffect } from 'react';
import idiomsData from '../data/toefl_idioms_150_with_korean.json';

export default function IdiomQuiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gridColumns, setGridColumns] = useState('1fr');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGridColumns(window.innerWidth > 600 ? '1fr 1fr' : '1fr');
    }
    const shuffled = idiomsData.sort(() => 0.5 - Math.random()).slice(0, 20);
    setQuestions(shuffled);
  }, []);

  const handleSelect = (optionIndex) => setSelected(optionIndex);

  const nextQuestion = () => {
    setAnswers([...answers, {
      question: questions[index].idiom,
      selected,
      correct: questions[index].correct,
      meaning: questions[index].meaning,
      meaning_ko: questions[index].meaning_ko
    }]);
    setSelected(null);
    setShowHint(false);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    const reshuffled = idiomsData.sort(() => 0.5 - Math.random()).slice(0, 20);
    setQuestions(reshuffled);
    setIndex(0);
    setAnswers([]);
    setSelected(null);
    setShowHint(false);
    setShowResults(false);
  };

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h1>TOEFL Idiom Quiz</h1>
      {!showResults ? (
        <>
          <h2>{questions[index].idiom}</h2>
          <p>What does this idiom mean?</p>
          <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: 10, margin: '20px auto', width: '90%' }}>
            {questions[index].options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  padding: 10,
                  fontSize: 16,
                  backgroundColor: selected === i ? '#0070f3' : '#fff',
                  color: selected === i ? '#fff' : '#000',
                  border: '1px solid #ccc',
                  borderRadius: 6
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <button onClick={() => setShowHint(true)} style={{ margin: 10 }}>Show Hint</button>
          {showHint && <p>{questions[index].meaning} ({questions[index].meaning_ko})</p>}
          <button onClick={nextQuestion} style={{ marginTop: 20, padding: 10 }}>Next</button>
        </>
      ) : (
        <>
          <h2>Quiz Completed</h2>
          <p>
            Correct: {answers.filter(a => a.selected === a.correct).length} / {questions.length}
          </p>
          <button onClick={restartQuiz} style={{ marginTop: 20, padding: 10 }}>Restart Quiz</button>
        </>
      )}
    </div>
  );
}