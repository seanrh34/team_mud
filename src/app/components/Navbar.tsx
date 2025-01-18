import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="p-8 text-white bg-gray-800">
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0 }}>
        <li>
          <Link className="hover:text-yellow-600" href="/">Home</Link>
        </li>
        <li>
          <Link className="hover:text-yellow-600" href="/about">About</Link>
        </li>
        <li>
          <Link className="hover:text-yellow-600" href="/leaderboard">Leaderboard</Link>
        </li>
        {/* <li>
          <Link href="/webcam">Webcam</Link>
        </li> */}
      </ul>
    </nav>
  );
}
