import React from 'react';

const leaderboardData = [
  { rank: 1, name: 'Alice', score: 1500 },
  { rank: 2, name: 'Bob', score: 1400 },
  { rank: 3, name: 'Charlie', score: 1350 },
  { rank: 4, name: 'Diana', score: 1300 },
  { rank: 5, name: 'Eve', score: 1250 },
];

export default function Leaderboard() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Leaderboard</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0 auto', maxWidth: '600px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ border: '1px solid #ccc', padding: '0.75rem' }}>Rank</th>
            <th style={{ border: '1px solid #ccc', padding: '0.75rem' }}>Name</th>
            <th style={{ border: '1px solid #ccc', padding: '0.75rem' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((player) => (
            <tr key={player.rank}>
              <td style={{ border: '1px solid #ccc', padding: '0.75rem', textAlign: 'center' }}>{player.rank}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.75rem' }}>{player.name}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.75rem', textAlign: 'center' }}>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
    