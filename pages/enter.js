import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import debounce from 'lodash.debounce';

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

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
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async username => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log('Firestore read executed!');
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    [],
  );

  const onSubmit = async e => {
    console.log('submitted');
    e.preventDefault();

    const userDocRef = firestore.doc(`users/${user.uid}`);
    const usernameDocRef = firestore.doc(`usernames/${formValue}`);

    try {
      // batch write both docs together
      const batch = firestore.batch();
      batch.set(userDocRef, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameDocRef, { uid: user.uid });

      await batch.commit();
    } catch (error) {
      console.error(error);
    }
  };

  const onChange = e => {
    setTouched(true);
    const val = e.target.value.toLowerCase();
    // Force form value typed in form to match correct format
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
            touched={touched}
          />

          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading, touched }) {
  console.log('username length:', username.length);
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else if (touched && username.length > 0 && username.length < 3) {
    return (
      <p className="text-danger">Usernames must be 3 or more characters</p>
    );
  } else if (touched && username.length === 0) {
    return <p></p>;
  } else {
    return <p></p>;
  }
}
