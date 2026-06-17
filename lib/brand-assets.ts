export const BRAND = {
  logo: "/icons/30_jam_session_match.png",
  logoAlt: "City Jam",
} as const;

export const STOCK = {
  hero: "/images/musician_jamming_global_v2.png",
  heroAlt: "Musicians jamming across cities",
  community: "/images/musician_band_building_v2.png",
  communityAlt: "Musicians building a band in the city",
  phoneJam: "/images/musician_phone_earphones_v2.png",
  phoneJamAlt: "Musician listening on phone",
  auth: "/images/musician_phone_earphones_v2.png",
} as const;

export const MUSICIAN_PHOTOS = [
  { src: "/images/04_classical_violinist.png", alt: "Classical violinist" },
  { src: "/images/05_beatboxer.png", alt: "Beatboxer" },
  { src: "/images/06_hiphop_producer.png", alt: "Hip-hop producer" },
  { src: "/images/07_jazz_pianist.png", alt: "Jazz pianist" },
  { src: "/images/08_folk_songwriter.png", alt: "Folk songwriter" },
  { src: "/images/09_electronic_dj.png", alt: "Electronic DJ" },
  { src: "/images/10_opera_singer.png", alt: "Opera singer" },
  { src: "/images/11_flamenco_guitarist.png", alt: "Flamenco guitarist" },
  { src: "/images/12_brass_ensemble.png", alt: "Brass ensemble" },
  { src: "/images/13_bedroom_producer.png", alt: "Bedroom producer" },
  { src: "/images/14_tabla_player.png", alt: "Tabla player" },
  { src: "/images/15_rock_bassist.png", alt: "Rock bassist" },
  { src: "/images/16_choir_conductor.png", alt: "Choir conductor" },
  { src: "/images/17_modular_synth.png", alt: "Modular synth player" },
  { src: "/images/18_string_quartet.png", alt: "String quartet" },
] as const;

export const ICONS = {
  microphone: "/icons/01_microphone.png",
  electricGuitar: "/icons/02_electric_guitar.png",
  soundWave: "/icons/02_sound_wave.png",
  drums: "/icons/03_drums.png",
  equalizer: "/icons/03_equalizer.png",
  audioSignal: "/icons/04_audio_signal.png",
  pianoKeys: "/icons/04_piano_keys.png",
  headphones: "/icons/05_headphones.png",
  waveform: "/icons/05_waveform.png",
  vinyl: "/icons/06_vinyl_record.png",
  tuningFork: "/icons/08_tuning_fork.png",
  speaker: "/icons/09_speaker.png",
  frequencyDial: "/icons/11_frequency_dial.png",
  cassette: "/icons/12_cassette_tape.png",
  mixingFaders: "/icons/13_mixing_faders.png",
  sonicBoom: "/icons/14_sonic_boom.png",
  globeSound: "/icons/16_globe_sound.png",
  lightning: "/icons/17_lightning_bolt.png",
  band: "/icons/19_band_silhouette.png",
  crown: "/icons/20_crown_badge.png",
  play: "/icons/21_play.png",
  search: "/icons/24_search.png",
  profile: "/icons/26_profile_user.png",
  chat: "/icons/27_chat_message.png",
  home: "/icons/29_home.png",
  jamMatch: "/icons/30_jam_session_match.png",
} as const;

export const TOOL_ICONS: Record<string, string> = {
  "/studio": ICONS.mixingFaders,
  "/project-match": ICONS.search,
  "/vault": ICONS.cassette,
  "/collab": ICONS.equalizer,
  "/circles": ICONS.band,
  "/listening-rooms": ICONS.headphones,
  "/signal-map": ICONS.globeSound,
  "/blind-echo": ICONS.microphone,
  "/echo-roulette": ICONS.frequencyDial,
  "/community": ICONS.band,
};

export const MOBILE_NAV_ICONS: Record<string, string> = {
  "/community": ICONS.band,
  "/studio": ICONS.mixingFaders,
  "/signal-map": ICONS.globeSound,
  "/blind-echo": ICONS.microphone,
  "/profile": ICONS.profile,
};
