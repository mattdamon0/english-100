import { useEffect, useState } from 'react';
import idioms from '../data/toefl_idioms_150_with_korean.json';

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
        meaning_ko: current.meaning_ko,
        example_sentence: current.example_sentence
      }
    ]);
    setSelected(null);
    setShowHint(false);
    setShowExample(false);
    setIndex(index + 1);
  };

  if (questions.length === 0) return <p>Loading...</p>;

  if (index >= questions.length) {
    const correct = results.filter(r => r.selected === r.correct).length;
    return (
      <div style={{ padding: '20px' }}>
        <h2>Quiz Finished!</h2>
        <p>Score: {correct} / {results.length}</p>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div style={{ padding: '20px' }}>
      <h2>{index + 1}. {current.idiom}</h2>
      {Array.isArray(current.options) &&
        current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              display: 'block',
              margin: '10px auto',
              padding: '10px',
              backgroundColor: selected === i ? '#0070f3' : '#eee'
            }}
          >
            {opt}
          </button>
        ))}
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setShowHint(true)} style={{ marginRight: '10px' }}>Show Hint</button>
        <button onClick={() => setShowExample(true)}>Show Example</button>
      </div>
      {showHint && (
        <p style={{ marginTop: '10px' }}>
          {current.meaning} ({current.meaning_ko})
        </p>
      )}
      {showExample && current.example_sentence && (
        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
          Example: {current.example_sentence}
        </p>
      )}
      <br />
      <button onClick={handleNext} disabled={selected === null}>Next</button>
    </div>
  );
}