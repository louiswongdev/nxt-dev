import Head from 'next/head';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import PostFeed from '../components/PostFeed';
import { firestore, fromMillis, postToJSON } from '../lib/firebase';

const LIMIT = 1;

export default function Home({ posts: allPosts }) {
  const [posts, setPosts] = useState(allPosts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  async function getMorePosts() {
    setLoading(true);
    const lastPost = posts[posts.length - 1];

    // check createAt field type. We'll need to make sure it's in timestamp format
    // If from server --> Firestore's timestamp format
    // If from client --> number format
    const cursor =
      typeof lastPost.createdAt === 'number'
        ? fromMillis(lastPost.createdAt) // creates a new timestamp
        : lastPost.createdAt;

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map(doc => doc.data());
    setPosts(posts => [...posts, ...newPosts]);
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  }

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && 'No more posts'}
    </main>
  );
}

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts },
  };
}
