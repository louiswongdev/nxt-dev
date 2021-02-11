import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}

export async function getServerSideProps({ query }) {
  const { username } = query;
  let user = null;
  let posts = null;

  const userDoc = await getUserWithUsername(username);

  // if no user, trigger 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  if (userDoc) {
    user = userDoc.data();

    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);

    posts = (await postsQuery.get()).docs.map(postToJSON);
    console.log('posts', posts);
  }

  return {
    props: { user, posts },
  };
}
