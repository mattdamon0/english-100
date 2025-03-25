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
        meaning_ko: current.meaning_ko
      }
    ]);
    setSelected(null);
    setShowHint(false);
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
      {Array.isArray(current.options) ? (
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
        ))
      ) : (
        <p style={{ color: 'red' }}>옵션 데이터를 불러올 수 없습니다.</p>
      )}
      <button onClick={() => setShowHint(true)}>Show Hint</button>
      {showHint && (
        <p style={{ marginTop: '10px' }}>
          {current.meaning} ({current.meaning_ko})
        </p>
      )}
      <br />
      <button onClick={handleNext} disabled={selected === null}>Next</button>
    </div>
  );
}