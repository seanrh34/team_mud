import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f8f9fa' }}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0 }}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/leaderboard">Leaderboard</Link>
        </li>
        {/* <li>
          <Link href="/webcam">Webcam</Link>
        </li> */}
      </ul>
    </nav>
  );
}
