import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth } from '../lib/firebase';

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <div className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">NXT</button>
          </Link>
        </li>

        {/* user signed in and has username */}
        {username && (
          <>
            <li className="push-left">
              <button onClick={() => auth.signOut()}>Sign Out</button>
            </li>
            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed in OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
