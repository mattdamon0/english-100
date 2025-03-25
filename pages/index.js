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
        example_sentence: current.example_sentence,
      }
    ]);
    setSelected(null);
    setShowHint(false);
    setShowExample(false);
    setIndex(index + 1);
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setSelected(null);
      setShowHint(false);
      setShowExample(false);
    }
  };

  const handleRestart = () => {
    const newQuestions = getRandomIdioms(idioms, 20);
    setQuestions(newQuestions);
    setIndex(0);
    setSelected(null);
    setShowHint(false);
    setShowExample(false);
    setResults([]);
  };

  if (questions.length === 0) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  if (index >= questions.length) {
    const correct = results.filter(r => r.selected === r.correct).length;
    const incorrectAnswers = results.filter(r => r.selected !== r.correct);

    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Quiz Finished!</h2>
        <p style={{ fontSize: '16px' }}>Score: {correct} / {results.length}</p>

        {incorrectAnswers.length > 0 && (
          <>
            <h3 style={{ fontSize: '18px' }}>Incorrect Answers:</h3>
            {incorrectAnswers.map((item, i) => (
              <div key={i} style={{ marginBottom: '10px', border: '1px solid #ddd', padding: '10px' }}>
                <strong>{item.idiom}</strong><br />
                <span>Answer: {item.meaning}</span><br />
                <span style={{ color: '#0070f3' }}>{item.meaning_ko}</span><br />
                <span style={{ fontSize: '14px' }}>{item.example_sentence}</span>
              </div>
            ))}
          </>
        )}

        <button
          onClick={handleRestart}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Try Another 20
        </button>

        <p style={{ marginTop: '30px', fontSize: '14px', color: '#888' }}>© 2025 Matt Damon</p>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', fontSize: '20px' }}>{index + 1}. {current.idiom}</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginTop: '20px'
      }}>
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: '10px',
              fontSize: '14px',
              backgroundColor: selected === i ? '#0070f3' : '#eee',
              color: selected === i ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              wordWrap: 'break-word'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
        gap: '10px'
      }}>
        <button onClick={handlePrev} style={{ flex: 1, padding: '12px', fontSize: '16px' }}>Previous</button>
        <button onClick={() => setShowHint(true)} style={{ flex: 1, padding: '12px', fontSize: '16px' }}>Hint</button>
        <button onClick={() => setShowExample(true)} style={{ flex: 1, padding: '12px', fontSize: '16px' }}>Example</button>
        <button
          onClick={handleNext}
          disabled={selected === null}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            backgroundColor: selected === null ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Next
        </button>
      </div>

      {showHint && (
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#444' }}>
          {current.meaning} <br />
          <span style={{ color: '#0070f3' }}>{current.meaning_ko}</span>
        </p>
      )}
      {showExample && (
        <p style={{ marginTop: '10px', fontSize: '14px', fontStyle: 'italic', color: '#555' }}>
          {current.example_sentence}
        </p>
      )}

      <p style={{ marginTop: '40px', fontSize: '14px', textAlign: 'center', color: '#888' }}>
        © 2025 Matt Damon
      </p>
    </div>
  );
}