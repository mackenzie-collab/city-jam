import ListeningRoomDetail from "@/components/ListeningRoomDetail";

export default function ListeningRoomPage({ params }: { params: { id: string } }) {
  return <ListeningRoomDetail roomId={params.id} />;
}
