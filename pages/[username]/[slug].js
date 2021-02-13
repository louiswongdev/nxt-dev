import Link from 'next/link';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext } from 'react';

import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';

import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import Metatags from '../../components/Metatags';
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton';

export default function PostPage({ post: postData, path }) {
  const postRef = firestore.doc(path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || postData;

  return (
    <main className={styles.container}>
      <Metatags title={post.title} description={post.title} />

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
}

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug);
    post = postToJSON(await postRef.get());

    // path of the referenced post document
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map(doc => {
    const { slug, username } = doc.data();

    return {
      params: { username, slug },
    };
  });

  return {
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    // The paths that have not been generated at build time will not result in a 404 page.
    // Instead, Next.js will SSR on the first request and return the generated HTML.
    fallback: 'blocking',
  };
}
