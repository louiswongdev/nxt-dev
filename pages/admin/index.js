import toast from 'react-hot-toast';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import kebabCase from 'lodash.kebabcase';

import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';
import { UserContext } from '../../lib/context';

import styles from '../../styles/Admin.module.css';

export default function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const ref = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts');

  const query = ref.orderBy('createdAt');
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map(doc => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  // Ensure slug is URL safe. Strip out characters like ?!/
  // How long to beat Cyperpunk? --> how-long-to-beat-cybperpunk
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  async function createPost(e) {
    e.preventDefault();

    const uid = auth.currentUser.uid;
    // get ref for doc that doesn't exist yet (we'll give it an id of our slug)
    const ref = firestore
      .collection('users')
      .doc(uid)
      .collection('posts')
      .doc(slug);

    // Give all fields a default value to prevent issues of accessing a property
    // that doesn't exist at a later time
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);

    toast.success('Post created!');

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  }

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create Post
      </button>
    </form>
  );
}
