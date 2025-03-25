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
        meaning_ko: current.meaning_ko,
        example: current.example_sentence,
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>{index + 1}. {current.idiom}</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '20px'
      }}>
        {current.options && current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: '10px',
              fontSize: '14px',
              backgroundColor: selected === i ? '#a5d8ff' : '#eee',
              color: selected === i ? 'black' : 'black',
              borderRadius: '8px'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => setShowHint(true)} style={{ padding: '10px 20px', fontSize: '16px' }}>Hint</button>
        <button onClick={() => setShowExample(true)} style={{ padding: '10px 20px', fontSize: '16px' }}>Example</button>
        <button onClick={handleBack} style={{ padding: '10px 20px', fontSize: '16px' }}>Back</button>
        <button onClick={handleNext} disabled={selected === null} style={{ padding: '10px 20px', fontSize: '16px' }}>Next</button>
      </div>

      {showHint && (
        <p style={{ marginTop: '10px', color: 'blue' }}>{current.meaning} ({current.meaning_ko})</p>
      )}
      {showExample && (
        <p style={{ marginTop: '10px', color: 'green' }}><strong>Example:</strong> {current.example_sentence}</p>
      )}
    </div>
  );
}