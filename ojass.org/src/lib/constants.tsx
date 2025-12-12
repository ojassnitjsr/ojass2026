import { IconType } from "react-icons";
import { BiSolidCalendarEvent } from "react-icons/bi";
import { FaGithub, FaHome, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FaHandshakeAngle, FaSquareInstagram } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { RiGalleryFill } from "react-icons/ri";

export type Theme = "utopia" | "dystopia";

export type DayKey = 1 | 2 | 3;

export type Icons = { title: string; element: IconType }[];

export const NavItems: Icons = [
    { title: "Home", element: FaHome },
    { title: "Events", element: BiSolidCalendarEvent },
    { title: "Gallery", element: RiGalleryFill },
    { title: "Sponsors", element: FaHandshakeAngle },
    { title: "Team", element: IoPeopleSharp },
];

export const SocialMediaItems: Icons = [
    { title: "Instagram", element: FaSquareInstagram },
    { title: "Twitter", element: FaTwitter },
    { title: "LinkedIn", element: FaLinkedin },
    { title: "GitHub", element: FaGithub },
];

export interface GalleryImage {
    src: string;
    caption: string;
}

export const galleryImages: GalleryImage[] = [
    {
        src: "image-1.jpg",
        caption:
            "30 knots <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2021",
    },
    {
        src: "image-2.jpg",
        caption:
            "Sad Mis-Step <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2024",
    },
    {
        src: "image-3.jpg",
        caption:
            "Mini Orange <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2014",
    },
    {
        src: "image-4.jpg",
        caption:
            "After Storm <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022",
    },
    {
        src: "image-5.jpg",
        caption:
            "Untitled <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2016",
    },
    {
        src: "image-6.jpg",
        caption:
            "Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022",
    },
    {
        src: "image-7.jpg",
        caption:
            "Cocoa Eggplant Tomato <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2025",
    },
    {
        src: "image-8.jpg",
        caption:
            "Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022",
    },
    {
        src: "image-9.jpg",
        caption:
            "Production Fun Fact (Eggs) <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2024",
    },
];

export interface GalleryCell {
    x: number;
    y: number;
    w: number;
    h: number;
}

export const galleryLayout: GalleryCell[] = [
    { x: 71, y: 58, w: 400, h: 270 },
    { x: 211, y: 255, w: 540, h: 360 },
    { x: 631, y: 158, w: 400, h: 270 },
    { x: 1191, y: 245, w: 260, h: 195 },
    { x: 351, y: 687, w: 260, h: 290 },
    { x: 751, y: 824, w: 205, h: 154 },
    { x: 911, y: 540, w: 260, h: 350 },
    { x: 1051, y: 803, w: 400, h: 300 },
    { x: 71, y: 922, w: 350, h: 260 },
];

export type TimelineData = {
    [K in DayKey]: {
        title: string;
        date: Date;
        events: {
            id: number;
            title: string;
            location: string;
            type: string;
            coords: { x: number; y: number };
            start: Date;
            end: Date;
            desc: string;
        }[];
    };
};

export const timelineData = (hour: number, t: Date): TimelineData => ({
    1: {
        title: "Day 1 - Monday",
        date: new Date(t.getTime() - 72 * hour),
        events: [
            // === PHASE 0: (Past) ===
            {
                id: 1,
                title: "STATION COLD START",
                location: "MAIN POWER PLANT",
                type: "setup",
                coords: { x: 0, y: 10 },
                start: new Date(t.getTime() - 72 * hour),
                end: new Date(t.getTime() - 70 * hour),
                desc: "Reactor ignition after 12-year hibernation. Thermal bloom within tolerance.",
            },
            {
                id: 2,
                title: "CORE INTEGRITY SCAN",
                location: "CENTRAL AXIS",
                type: "setup",
                coords: { x: 25, y: 10 },
                start: new Date(t.getTime() - 68 * hour),
                end: new Date(t.getTime() - 66 * hour),
                desc: "Structural resonance mapping confirms no microfractures in chroniton shielding.",
            },
            {
                id: 3,
                title: "AI BOOT SEQUENCE",
                location: "COGNITIVE ENGINE",
                type: "setup",
                coords: { x: 50, y: 10 },
                start: new Date(t.getTime() - 64 * hour),
                end: new Date(t.getTime() - 62 * hour),
                desc: "Axiom Core v9.3 initialized. Ethics module: nominal. Personality matrix: dormant.",
            },
            {
                id: 4,
                title: "PERIPHERAL NODE SYNC",
                location: "DATA RING ALPHA",
                type: "setup",
                coords: { x: 75, y: 10 },
                start: new Date(t.getTime() - 60 * hour),
                end: new Date(t.getTime() - 58 * hour),
                desc: "212 subsystems online. Latency < 3ms. All nodes report clean handshakes.",
            },

            // === PHASE 1: Past → Present ===
            {
                id: 5,
                title: "GRAVITY FIELD STABILIZATION",
                location: "INERTIA CONTROL",
                type: "setup",
                coords: { x: 100, y: 10 },
                start: new Date(t.getTime() - 56 * hour),
                end: new Date(t.getTime() - 54 * hour),
                desc: "Artificial gravity restored to 0.92g. Minor tidal shear in Sector G.",
            },
            {
                id: 6,
                title: "ATMOSPHERE REPLENISH",
                location: "LIFE SUPPORT HUB",
                type: "setup",
                coords: { x: 100, y: 30 },
                start: new Date(t.getTime() - 52 * hour),
                end: new Date(t.getTime() - 50 * hour),
                desc: "O₂/N₂ mix stabilized. Trace xenon purge complete. Bio-readiness: GREEN.",
            },
            {
                id: 7,
                title: "SECURITY PROTOCOL ENGAGE",
                location: "DEFENSE NEXUS",
                type: "setup",
                coords: { x: 75, y: 30 },
                start: new Date(t.getTime() - 48 * hour),
                end: new Date(t.getTime() - 46 * hour),
                desc: "Perimeter drones deployed. Neural firewall active. No external pings detected.",
            },
            {
                id: 8,
                title: "CREW PODS DEEP THAW",
                location: "CRYO BAY",
                type: "setup",
                coords: { x: 50, y: 30 },
                start: new Date(t.getTime() - 44 * hour),
                end: new Date(t.getTime() - 40 * hour),
                desc: "7 crew members revived. Neural sync at 97%. Commander Vega first to awaken.",
            },

            // === PHASE 2: Approaching Now ===
            {
                id: 9,
                title: "SENSOR ARRAY DEPLOY",
                location: "OBSERVATION DOME",
                type: "setup",
                coords: { x: 25, y: 30 },
                start: new Date(t.getTime() - 36 * hour),
                end: new Date(t.getTime() - 34 * hour),
                desc: "Quantum lidar and neutrino scopes active. Deep-field scan initiated.",
            },
            {
                id: 10,
                title: "COMM RELAY ALIGNMENT",
                location: "ANTENNA ARRAY",
                type: "setup",
                coords: { x: 0, y: 30 },
                start: new Date(t.getTime() - 30 * hour),
                end: new Date(t.getTime() - 28 * hour),
                desc: "Link established with Luna Relay. Signal strength: optimal. No Earth response yet.",
            },
        ],
    },
    2: {
        title: "Day 2 - Tuesday",
        date: new Date(t.getTime() - 12 * hour),
        events: [
            {
                id: 11,
                title: "RESOURCE INVENTORY",
                location: "STORAGE VAULTS",
                type: "setup",
                coords: { x: 0, y: 50 },
                start: new Date(t.getTime() - 24 * hour),
                end: new Date(t.getTime() - 22 * hour),
                desc: "Fusion pellets: 94%. Med-packs: full. Archive crystals: intact.",
            },
            {
                id: 12,
                title: "COMMAND BRIDGE POWER-UP",
                location: "OPS CENTER",
                type: "setup",
                coords: { x: 25, y: 50 },
                start: new Date(t.getTime() - 18 * hour),
                end: new Date(t.getTime() - 16 * hour),
                desc: "Holographic interface booting. Tactical, nav, and science stations online.",
            },

            // === PHASE 3: Now & Near Future ===
            {
                id: 13,
                title: "CORE STABILIZATION FEEDBACK LOOP",
                location: "QUANTUM CORE CHAMBER",
                type: "active",
                coords: { x: 50, y: 50 },
                start: new Date(t.getTime() - 2 * hour),
                end: new Date(t.getTime() + 2 * hour),
                desc: "Resonance dampeners engaged. Core fluctuation at 0.8%. Holding steady.",
            },
            {
                id: 14,
                title: "FIRST CONTACT PROTOCOL",
                location: "XENOCOMM LAB",
                type: "active",
                coords: { x: 75, y: 50 },
                start: new Date(t.getTime() - 45 * 60 * 1000),
                end: new Date(t.getTime() + 3 * hour),
                desc: "Decoding alien beacon from Proxima b. Pattern matches archival 'Echo' signal.",
            },
            {
                id: 15,
                title: "CREW BRIEFING & ASSIGNMENTS",
                location: "MISSION THEATER",
                type: "active",
                coords: { x: 100, y: 50 },
                start: new Date(t.getTime() - 30 * 60 * 1000),
                end: new Date(t.getTime() + 1 * hour),
                desc: "Vega outlines Deep Core descent plan. Dr. Lin assigned xenolinguistics lead.",
            },
            {
                id: 16,
                title: "DRILL: CORE BREACH SIM",
                location: "TRAINING SIMULATOR",
                type: "active",
                coords: { x: 100, y: 70 },
                start: new Date(t.getTime() - 15 * 60 * 1000),
                end: new Date(t.getTime() + 45 * 60 * 1000),
                desc: "Team response time: 2m 18s. Containment foam deployment successful.",
            },
        ],
    },
    3: {
        title: "Day 3 - Wednesday",
        date: new Date(t.getTime() + 6 * hour),
        events: [
            // === PHASE 4: Future ===
            {
                id: 17,
                title: "ELEVATOR SHAFT PRESSURIZATION",
                location: "DESCENT SHAFT ECHO",
                type: "future",
                coords: { x: 75, y: 70 },
                start: new Date(t.getTime() + 1 * hour),
                end: new Date(t.getTime() + 1.5 * hour),
                desc: "Magnetic rails calibrated. Vacuum seals verified. Ready for descent pod.",
            },
            {
                id: 18,
                title: "DEEP CORE ENTRY",
                location: "CORE ACCESS AIRLOCK",
                type: "future",
                coords: { x: 50, y: 70 },
                start: new Date(t.getTime() + 2 * hour),
                end: new Date(t.getTime() + 2.25 * hour),
                desc: "Radiation shielding engaged. Bio-monitors synced. 'No return' point acknowledged.",
            },
            {
                id: 19,
                title: "SINGULARITY INTERFACE",
                location: "CORE HEART",
                type: "future",
                coords: { x: 25, y: 70 },
                start: new Date(t.getTime() + 3 * hour),
                end: new Date(t.getTime() + 4 * hour),
                desc: "Direct neural link to the artifact. Warning: Temporal drift detected.",
            },
            {
                id: 20,
                title: "TRUTH DOWNLOAD INITIATED",
                location: "MEMORY VAULT (FINAL)",
                type: "future",
                coords: { x: 0, y: 70 },
                start: new Date(t.getTime() + 5 * hour),
                end: new Date(t.getTime() + 5.5 * hour),
                desc: "The Station was never a station. It’s a seed. And we are the gardeners.",
            },
        ],
    },
});
