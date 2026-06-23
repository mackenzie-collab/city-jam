import ScenePostPage from "./ScenePostClient";
import { fetchAudioPost, fetchComments } from "@/lib/scene";

export default async function Page({ params }: { params: { id: string } }) {
  const [initialPost, initialComments] = await Promise.all([
    fetchAudioPost(params.id),
    fetchComments(params.id),
  ]);

  return (
    <ScenePostPage
      postId={params.id}
      initialPost={initialPost}
      initialComments={initialComments}
    />
  );
}
