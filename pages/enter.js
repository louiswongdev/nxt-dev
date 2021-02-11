import React, { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth, googleAuthProvider } from '../lib/firebase';

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} alt="google" /> Sign in with Google
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}></button>;
}

function UsernameForm() {
  return <p>test</p>;
}

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  console.log('user', user);
  console.log('username', username);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}
