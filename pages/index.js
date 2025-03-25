import { useEffect, useState } from 'react';
import idioms from '../data/toefl_idioms_150_with_korean_clean.json';

function getRandomIdioms(data, count) {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const randomIdioms = getRandomIdioms(idioms, 20);
    setQuestions(randomIdioms);
  }, []);

  const handleNext = () => {
    const current = questions[index];
    setResults([
      ...results,
      {
        idiom: current.idiom,
        selected,
        correct: current.correct,
        meaning: current.meaning,
        example: current.example_sentence
      }
    ]);
    setSelected(null);
    setShowHint(false);
    setShowExample(false);
    setIndex(index + 1);
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex(index - 1);
      setSelected(null);
      setShowHint(false);
      setShowExample(false);
    }
  };

  const handleRestart = () => {
    const randomIdioms = getRandomIdioms(idioms, 20);
    setQuestions(randomIdioms);
    setIndex(0);
    setSelected(null);
    setShowHint(false);
    setShowExample(false);
    setResults([]);
  };

  if (questions.length === 0) return <p>Loading...</p>;

  if (index >= questions.length) {
    const correct = results.filter(r => r.selected === r.correct).length;
    const incorrect = results.length - correct;

    return (
      <div style={{ padding: '20px' }}>
        <h2>Quiz Finished!</h2>
        <p>Correct: {correct} | Incorrect: {incorrect} / {results.length}</p>

        <div style={{ marginTop: '20px' }}>
          {results.map((r, i) => (
            <div key={i} style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              marginBottom: '10px', 
              backgroundColor: r.selected === r.correct ? '#e6ffe6' : '#ffe6e6' 
            }}>
              <strong>{r.idiom}</strong><br />
              Your Answer: {r.selected !== null ? r.selected + 1 : 'None'}<br />
              Correct Answer: {r.correct + 1}<br />
              Meaning: {r.meaning}<br />
              Example: {r.example}
            </div>
          ))}
        </div>

        <button onClick={handleRestart} style={{ marginTop: '20px', padding: '14px', fontSize: '16px' }}>
          Try Again
        </button>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div style={{ padding: '20px' }}>
      <h2>{index + 1}. {current.idiom}</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '20px'
      }}>
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: '10px',
              fontSize: '14px',
              backgroundColor: selected === i ? '#0070f3' : '#eee',
              color: selected === i ? '#fff' : '#000',
              whiteSpace: 'normal',
              wordWrap: 'break-word'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setShowHint(true)} style={{ padding: '14px', fontSize: '16px' }}>
          Show Hint
        </button>
        <button onClick={() => setShowExample(true)} style={{ padding: '14px', fontSize: '16px' }}>
          Show Example
        </button>
        <button onClick={handleNext} disabled={selected === null} style={{ padding: '14px', fontSize: '16px' }}>
          Next
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        {index > 0 && (
          <button onClick={handleBack} style={{ padding: '10px', fontSize: '14px' }}>
            Back
          </button>
        )}
        {showHint && <p style={{ marginTop: '10px', color: 'blue' }}>Hint: {current.meaning}</p>}
        {showExample && <p style={{ marginTop: '10px', color: 'green' }}>Example: {current.example_sentence}</p>}
      </div>
    </div>
  );
}