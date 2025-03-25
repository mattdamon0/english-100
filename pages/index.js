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
        example_sentence: current.example_sentence
      }
    ]);
    setSelected(null);
    setShowHint(false);
    setShowExample(false);
    setIndex(index + 1);
  };

  const handlePrevious = () => {
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
    const incorrect = results.filter(r => r.selected !== r.correct);
    return (
      <div style={{ padding: '20px', minHeight: '100vh', position: 'relative' }}>
        <h2>Quiz Finished!</h2>
        <p>Score: {correct} / {results.length}</p>

        {incorrect.length > 0 && (
          <>
            <h3>Incorrect Answers:</h3>
            {incorrect.map((r, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <strong>{r.idiom}</strong><br />
                Correct: {r.meaning} ({r.meaning_ko})<br />
                Your Answer: {r.selected !== null ? r.selected + 1 : 'None'}
              </div>
            ))}
          </>
        )}

        <button onClick={handleRestart} style={{ marginTop: '20px', padding: '12px 24px', fontSize: '16px' }}>
          Try New Quiz
        </button>

        <footer style={{ marginTop: '40px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
          © 2025 Matt Damon
        </footer>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div style={{ padding: '20px', minHeight: '100vh', position: 'relative' }}>
      <h2>{index + 1}. {current.idiom}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: '10px',
              fontSize: '14px',
              backgroundColor: selected === i ? '#0070f3' : '#eee',
              color: selected === i ? '#fff' : '#000'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={{
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', textAlign: 'left' }}>
          <button onClick={handlePrevious} style={{ padding: '12px 20px', fontSize: '16px' }}>Back</button>
        </div>
        <div style={{ flex: '1', textAlign: 'center' }}>
          <button onClick={() => setShowHint(true)} style={{ padding: '12px 20px', fontSize: '16px', marginRight: '10px' }}>Hint</button>
          <button onClick={() => setShowExample(true)} style={{ padding: '12px 20px', fontSize: '16px' }}>Example</button>
        </div>
        <div style={{ flex: '1', textAlign: 'right' }}>
          <button onClick={handleNext} disabled={selected === null} style={{ padding: '12px 20px', fontSize: '16px' }}>Next</button>
        </div>
      </div>

      {showHint && (
        <p style={{ marginTop: '15px', fontSize: '16px', color: '#444' }}>
          {current.meaning} <br />
          <span style={{ color: '#0070f3' }}>{current.meaning_ko}</span>
        </p>
      )}

      {showExample && (
        <p style={{ marginTop: '15px', fontStyle: 'italic', color: '#555' }}>
          {current.example_sentence}
        </p>
      )}

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
        © 2025 Matt Damon
      </footer>
    </div>
  );
}