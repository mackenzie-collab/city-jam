import { notFound } from "next/navigation";
import FeatureShell from "@/components/FeatureShell";
import ArtistFeatureProfile from "@/components/ArtistFeatureProfile";
import { fetchProfileByUsername } from "@/lib/profiles";
import { ICONS } from "@/lib/brand-assets";

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await fetchProfileByUsername(params.username);
  if (!profile) notFound();

  return (
    <FeatureShell
      title={profile.display_name}
      iconSrc={ICONS.profile}
      badge="Artist Feature"
      heading={
        <>
          {profile.display_name} / <span className="text-cj-gold-bright">Feature.</span>
        </>
      }
      subtitle="Manifesto, tracks, and the sound behind the name."
      maxWidth="xl"
    >
      <ArtistFeatureProfile profile={profile} />
    </FeatureShell>
  );
}
