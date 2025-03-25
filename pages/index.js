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
        <h2>퀴즈 완료!</h2>
        <p>맞춘 개수: {correct} / {results.length}</p>
        <button onClick={() => {
          const randomIdioms = getRandomIdioms(idioms, 20);
          setQuestions(randomIdioms);
          setIndex(0);
          setResults([]);
        }}>
          다시 시작
        </button>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div style={{ padding: '20px' }}>
      <h2>{index + 1}. {current.idiom}</h2>
      {(Array.isArray(current.options) ? current.options : []).map((opt, i) => (
        <button
          key={i}
          onClick={() => setSelected(i)}
          style={{
            display: 'block',
            margin: '10px auto',
            padding: '10px',
            backgroundColor: selected === i ? '#0070f3' : '#eee',
            color: selected === i ? 'white' : 'black',
            width: '80%',
            fontSize: '16px'
          }}
        >
          {opt}
        </button>
      ))}
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setShowHint(true)} style={{ marginRight: '10px' }}>힌트 보기</button>
        <button onClick={handleNext} disabled={selected === null}>다음</button>
      </div>
      {showHint && (
        <p style={{ marginTop: '10px', color: 'blue' }}>
          {current.meaning} ({current.meaning_ko})
        </p>
      )}
    </div>
  );
}