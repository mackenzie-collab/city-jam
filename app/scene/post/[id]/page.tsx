import ScenePostPage from "./ScenePostClient";

export default function Page({ params }: { params: { id: string } }) {
  return <ScenePostPage postId={params.id} />;
}
