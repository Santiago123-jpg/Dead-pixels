export type Platform = "Steam" | "Epic Games" | "Xbox / Microsoft";
export type InstallState = "installed" | "not-installed" | "running";

export type PriceRow = {
  store: "Steam" | "Epic Games" | "Xbox / Microsoft" | "Eneba";
  price: number;
  discount?: number;
  tag?: string;
};

export type Game = {
  id: string;
  title: string;
  subtitle: string;
  platform: Platform;
  genre: string;
  year: string;
  rating: string;
  size: string;
  state: InstallState;
  price: number;
  originalPrice: number;
  discount?: number;
  coverClass: string;
  coverLabel: string;
  accent: string;
  lastPlayed?: string;
  comparison: PriceRow[];
  description: string;
  featured?: boolean;
};

export const games: Game[] = [
  {
    id: "signal-drift",
    title: "Signal Drift",
    subtitle: "The city is still listening.",
    platform: "Steam",
    genre: "Action / Synthwave",
    year: "2025",
    rating: "93%",
    size: "48.2 GB",
    state: "running",
    price: 19.99,
    originalPrice: 29.99,
    discount: 33,
    coverClass: "cover-signal",
    coverLabel: "SIGNAL\nDRIFT",
    accent: "#f04444",
    lastPlayed: "Ahora mismo",
    featured: true,
    comparison: [
      { store: "Steam", price: 19.99, discount: 33, tag: "Mejor precio oficial" },
      { store: "Epic Games", price: 21.99, discount: 27 },
      { store: "Xbox / Microsoft", price: 24.99 },
      { store: "Eneba", price: 16.42, tag: "Marketplace" },
    ],
    description: "Un thriller de acción en una ciudad de neón donde cada transmisión revela una nueva capa del misterio.",
  },
  {
    id: "void-runner",
    title: "Void Runner",
    subtitle: "No map. No backup. No way back.",
    platform: "Epic Games",
    genre: "Roguelite / FPS",
    year: "2024",
    rating: "88%",
    size: "31.6 GB",
    state: "installed",
    price: 14.99,
    originalPrice: 29.99,
    discount: 50,
    coverClass: "cover-void",
    coverLabel: "VOID\nRUNNER",
    accent: "#e3a2ff",
    lastPlayed: "Ayer, 22:14",
    comparison: [
      { store: "Steam", price: 17.99 },
      { store: "Epic Games", price: 14.99, discount: 50, tag: "Mejor precio oficial" },
      { store: "Xbox / Microsoft", price: 19.99 },
      { store: "Eneba", price: 12.74, tag: "Marketplace" },
    ],
    description: "Corre a través de estaciones imposibles, roba tecnología y convierte cada intento en una nueva ruta.",
  },
  {
    id: "hollow-circuit",
    title: "Hollow Circuit",
    subtitle: "Every machine remembers.",
    platform: "Steam",
    genre: "Metroidvania",
    year: "2023",
    rating: "96%",
    size: "12.4 GB",
    state: "installed",
    price: 12.49,
    originalPrice: 24.99,
    discount: 50,
    coverClass: "cover-hollow",
    coverLabel: "HOLLOW\nCIRCUIT",
    accent: "#7fdbca",
    lastPlayed: "18 oct, 19:40",
    comparison: [
      { store: "Steam", price: 12.49, discount: 50, tag: "Mejor precio oficial" },
      { store: "Epic Games", price: 14.99, discount: 40 },
      { store: "Xbox / Microsoft", price: 16.99 },
      { store: "Eneba", price: 10.02, tag: "Marketplace" },
    ],
    description: "Explora una fábrica abandonada, recupera tus recuerdos y decide qué parte de la máquina merece despertar.",
  },
  {
    id: "neon-division",
    title: "Neon Division",
    subtitle: "The night shift never ends.",
    platform: "Epic Games",
    genre: "Tactical / Co-op",
    year: "2025",
    rating: "91%",
    size: "62.8 GB",
    state: "not-installed",
    price: 39.99,
    originalPrice: 39.99,
    coverClass: "cover-neon",
    coverLabel: "NEON\nDIVISION",
    accent: "#ffcb69",
    comparison: [
      { store: "Steam", price: 39.99 },
      { store: "Epic Games", price: 39.99, tag: "Precio estándar" },
      { store: "Xbox / Microsoft", price: 44.99 },
      { store: "Eneba", price: 31.87, tag: "Marketplace" },
    ],
    description: "Forma un equipo de especialistas y toma una ciudad vertical antes de que amanezca.",
  },
  {
    id: "dead-frequency",
    title: "Dead Frequency",
    subtitle: "Turn the dial. Hold your breath.",
    platform: "Steam",
    genre: "Horror / Narrative",
    year: "2022",
    rating: "89%",
    size: "8.8 GB",
    state: "not-installed",
    price: 7.49,
    originalPrice: 14.99,
    discount: 50,
    coverClass: "cover-frequency",
    coverLabel: "DEAD\nFREQUENCY",
    accent: "#ef6f9b",
    comparison: [
      { store: "Steam", price: 7.49, discount: 50, tag: "Mejor precio oficial" },
      { store: "Epic Games", price: 9.99 },
      { store: "Xbox / Microsoft", price: 11.99 },
      { store: "Eneba", price: 6.18, tag: "Marketplace" },
    ],
    description: "Una radio, una casa aislada y una frecuencia que solo aparece cuando alguien deja de respirar.",
  },
  {
    id: "pixel-wasteland",
    title: "Pixel Wasteland",
    subtitle: "Build small. Survive big.",
    platform: "Xbox / Microsoft",
    genre: "Survival / Builder",
    year: "2024",
    rating: "86%",
    size: "20.1 GB",
    state: "not-installed",
    price: 24.99,
    originalPrice: 29.99,
    discount: 17,
    coverClass: "cover-wasteland",
    coverLabel: "PIXEL\nWASTELAND",
    accent: "#d3f26a",
    comparison: [
      { store: "Steam", price: 27.99 },
      { store: "Epic Games", price: 26.99 },
      { store: "Xbox / Microsoft", price: 24.99, discount: 17, tag: "Mejor precio oficial" },
      { store: "Eneba", price: 21.36, tag: "Marketplace" },
    ],
    description: "Diseña una base, encuentra a tu gente y mantén encendida la última pantalla del desierto.",
  },
];

export const featuredGames = games.filter(game => game.featured);
export const offerGames = games.filter(game => game.discount && game.discount >= 33);
export const platforms: Array<"Todas" | Platform> = ["Todas", "Steam", "Epic Games", "Xbox / Microsoft"];
