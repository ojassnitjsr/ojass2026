import { IconType } from "react-icons";
import { BiSolidCalendarEvent } from "react-icons/bi";
import {
    FaFacebook,
    FaHome,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
} from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { RiGalleryFill, RiMapPinTimeLine } from "react-icons/ri";

export type Theme = "utopia" | "dystopia";

export type DayKey = 1 | 2 | 3 | 4;

export type Icons = { title: string; element: IconType }[];

export const NavItems: Icons = [
    { title: "Home", element: FaHome },
    { title: "Events", element: BiSolidCalendarEvent },
    { title: "Gallery", element: RiGalleryFill },
    { title: "Timeline", element: RiMapPinTimeLine },
    { title: "Team", element: IoPeopleSharp },
];

export const SocialMediaItems: Icons = [
    { title: "Instagram", element: FaInstagram },
    { title: "YouTube", element: FaYoutube },
    { title: "LinkedIn", element: FaLinkedin },
    { title: "Facebook", element: FaFacebook },
];

export interface GalleryImage {
    src: string;
    caption: string;
}

export const galleryImages: GalleryImage[] = [
    {
        src: "/compressed-20241117_192238 - Copy.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-ASH04152 - Copy.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-DSC02484 - Copy.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-DSC02962.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-DSC02980.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-DSC03223.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-DSC03232.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-DSC03282.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-DSC_0663.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-IMG_0009.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-IMG_0042 - Copy.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-IMG_0047 - Copy.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-IMG_0250 - Copy.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-IMG_0252 - Copy.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-IMG_0319.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-_DSC1322.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-_DSC1327.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-_DSC1490.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-_DSC1652.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-_DSC1653.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-_DSC1900 - Copy.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-_DSC1900.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-_DSC1964.jpg",
        caption: "OJASS 2025 glimps",
    },
    {
        src: "/compressed-_DSC2002.jpg",
        caption: "OJASS 2025 glimps",
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

type EventLocations =
    | "LECTURE HALL COMPLEX"
    | "COMPUTER CENTRE"
    | "DOWNS GROUND"
    | "STUDENT ACTIVITY CENTRE"
    | "OPEN AIR THEATRE"
    | "PARKING LOT";

export type TimelineData = {
    [K in DayKey]: {
        title: string;
        date: Date;
        events: {
            id: number;
            title: string;
            location: EventLocations;
            coords: { x: number; y: number };
            start: Date;
            end: Date;
            desc: string;
        }[];
    };
};

export const timelineData: TimelineData = {
    1: {
        title: "Day 1 - Thursday",
        date: new Date("2026-02-19T00:00:00"),
        events: [
            {
                id: 1,
                title: "OJASS OLYMPIAD",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 10, y: 20 },
                start: new Date("2026-02-19T09:00:00"),
                end: new Date("2026-02-19T12:00:00"),
                desc: "The ultimate aptitude test. Challenge your logical and scientific reasoning against the best minds.",
            },
            {
                id: 2,
                title: "PIXEL SYNC",
                location: "COMPUTER CENTRE",
                coords: { x: 30, y: 15 },
                start: new Date("2026-02-19T09:00:00"),
                end: new Date("2026-02-19T12:00:00"),
                desc: "Digital art competition. Create stunning visuals and designs within a time limit.",
            },
            {
                id: 3,
                title: "HACK DE SCIENCE",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 50, y: 30 },
                start: new Date("2026-02-19T09:00:00"),
                end: new Date("2026-02-20T21:00:00"),
                desc: "36-hour hackathon. Build innovative software solutions for real-world scientific problems.",
            },
            {
                id: 4,
                title: "ROBO RUMBLE",
                location: "DOWNS GROUND",
                coords: { x: 70, y: 20 },
                start: new Date("2026-02-19T09:00:00"),
                end: new Date("2026-02-19T12:00:00"),
                desc: "Clash of metal. Combat robots fight for survival in a high-stakes arena.",
            },
            {
                id: 5,
                title: "CASE STUDY CHALLENGE",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 90, y: 30 },
                start: new Date("2026-02-19T10:30:00"),
                end: new Date("2026-02-19T13:30:00"),
                desc: "Analyze complex business scenarios and present strategic solutions to industry experts.",
            },
            {
                id: 6,
                title: "CHESS",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 80, y: 60 },
                start: new Date("2026-02-19T11:00:00"),
                end: new Date("2026-02-19T14:30:00"),
                desc: "Strategic warfare on 64 squares. Checkmate your opponents in this classic battle of wits.",
            },
            {
                id: 7,
                title: "SANRACHNA",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 60, y: 50 },
                start: new Date("2026-02-19T14:00:00"),
                end: new Date("2026-02-19T17:00:00"),
                desc: "Structural engineering challenge. Design and build stable structures under constraints.",
            },
            {
                id: 8,
                title: "RURAL TECH IDEATHON",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 40, y: 60 },
                start: new Date("2026-02-19T14:30:00"),
                end: new Date("2026-02-19T17:00:00"),
                desc: "Innovate for rural India. Ideate solutions for agriculture, healthcare, and education.",
            },
            {
                id: 9,
                title: "KURUKSHETRA QUALIFIERS",
                location: "PARKING LOT",
                coords: { x: 20, y: 50 },
                start: new Date("2026-02-19T17:00:00"),
                end: new Date("2026-02-19T21:00:00"),
                desc: "The e-sports battle begins. Qualifiers for the main gaming championship.",
            },
        ],
    },
    2: {
        title: "Day 2 - Friday",
        date: new Date("2026-02-20T00:00:00"),
        events: [
            {
                id: 10,
                title: "TRACE BOT CHALLENGE",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 10, y: 20 },
                start: new Date("2026-02-20T09:00:00"),
                end: new Date("2026-02-20T13:00:00"),
                desc: "Autonomous line-follower robots race against time and obstacles.",
            },
            {
                id: 11,
                title: "THE GREAT INDIAN MELA",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 30, y: 30 },
                start: new Date("2026-02-20T09:00:00"),
                end: new Date("2026-02-20T12:00:00"),
                desc: "A vibrant showcase of culture, food, crafts, and creativity.",
            },
            {
                id: 12,
                title: "AQUA RACE",
                location: "DOWNS GROUND",
                coords: { x: 70, y: 30 },
                start: new Date("2026-02-20T09:00:00"),
                end: new Date("2026-02-20T11:00:00"),
                desc: "Radio-controlled water bots race across the lake surface.",
            },
            {
                id: 13,
                title: "FRAMES & TALES",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 90, y: 20 },
                start: new Date("2026-02-20T09:00:00"),
                end: new Date("2026-02-20T21:00:00"),
                desc: "Photography and storytelling exhibition contest.",
            },
            {
                id: 14,
                title: "SIMULATION SPRINT",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 100, y: 50 },
                start: new Date("2026-02-20T10:30:00"),
                end: new Date("2026-02-20T12:30:00"),
                desc: "High-speed process simulation and modeling contest.",
            },
            {
                id: 15,
                title: "UNDER WATER TRACING",
                location: "DOWNS GROUND",
                coords: { x: 80, y: 60 },
                start: new Date("2026-02-20T11:00:00"),
                end: new Date("2026-02-20T13:00:00"),
                desc: "Underwater autonomous robot navigation and tracing challenge.",
            },
            {
                id: 16,
                title: "MOCK IPL AUCTION",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 60, y: 70 },
                start: new Date("2026-02-20T12:30:00"),
                end: new Date("2026-02-20T14:30:00"),
                desc: "Strategic bidding war. Build the dream team with limited virtual budget.",
            },
            {
                id: 17,
                title: "VISHWA CODE MANIA",
                location: "COMPUTER CENTRE",
                coords: { x: 50, y: 50 },
                start: new Date("2026-02-20T11:00:00"),
                end: new Date("2026-02-20T14:30:00"),
                desc: "Competitive coding marathon. Solve algorithmic challenges against the clock.",
            },
            {
                id: 18,
                title: "FC-24",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 20, y: 50 },
                start: new Date("2026-02-20T15:00:00"),
                end: new Date("2026-02-20T17:00:00"),
                desc: "Virtual football championship using EA Sports FC 24.",
            },
            {
                id: 19,
                title: "KURUKSHETRA FINALS",
                location: "PARKING LOT",
                coords: { x: 20, y: 80 },
                start: new Date("2026-02-20T17:00:00"),
                end: new Date("2026-02-20T21:00:00"),
                desc: "The final showdown. Top gamers compete for the championship title.",
            },
        ],
    },
    3: {
        title: "Day 3 - Saturday",
        date: new Date("2026-02-21T00:00:00"),
        events: [
            {
                id: 20,
                title: "AI HACKATHON",
                location: "COMPUTER CENTRE",
                coords: { x: 15, y: 25 },
                start: new Date("2026-02-21T09:00:00"),
                end: new Date("2026-02-21T13:00:00"),
                desc: "Building the future. Develop AI models to solve complex datasets.",
            },
            {
                id: 21,
                title: "NO GROUND ZONE",
                location: "DOWNS GROUND",
                coords: { x: 35, y: 15 },
                start: new Date("2026-02-21T09:00:00"),
                end: new Date("2026-02-21T11:00:00"),
                desc: "Drone obstacle course. Pilots maneuver through tight spaces without touching ground.",
            },
            {
                id: 22,
                title: "START UP IDEATHON",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 55, y: 25 },
                start: new Date("2026-02-21T09:00:00"),
                end: new Date("2026-02-21T12:00:00"),
                desc: "Pitch your billion-dollar idea to investors and industry leaders.",
            },
            {
                id: 23,
                title: "ROBO SOCCER",
                location: "OPEN AIR THEATRE",
                coords: { x: 75, y: 15 },
                start: new Date("2026-02-21T13:00:00"),
                end: new Date("2026-02-21T21:00:00"),
                desc: "Robots playing football. Fast-paced 1v1 and 2v2 bot matches.",
            },
            {
                id: 24,
                title: "VALORANT",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 85, y: 55 },
                start: new Date("2026-02-21T12:30:00"),
                end: new Date("2026-02-21T14:30:00"),
                desc: "Tactical shooter tournament. 5v5 teams compete for dominance.",
            },
            {
                id: 25,
                title: "CINESCRIPT",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 65, y: 65 },
                start: new Date("2026-02-21T14:30:00"),
                end: new Date("2026-02-21T16:30:00"),
                desc: "Short film making and scriptwriting competition for aspiring fillmmakers.",
            },
            {
                id: 26,
                title: "FIX-IT FIESTA",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 45, y: 75 },
                start: new Date("2026-02-21T16:30:00"),
                end: new Date("2026-02-21T18:30:00"),
                desc: "Hardware debugging challenge. Diagnose and fix broken electronic circuits.",
            },
            {
                id: 27,
                title: "THE FORGE",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 25, y: 65 },
                start: new Date("2026-02-21T18:30:00"),
                end: new Date("2026-02-21T21:00:00"),
                desc: "Mock TATA Crucible Quiz. The ultimate business and cognitive quiz.",
            },
            {
                title: "MAZE MARATHON",
                id: 28,
                location: "OPEN AIR THEATRE",
                coords: { x: 50, y: 45 },
                start: new Date("2026-02-21T19:00:00"),
                end: new Date("2026-02-21T21:00:00"),
                desc: "Micromouse competition. Autonomous bots solve complex mazes.",
            },
        ],
    },
    4: {
        title: "Day 4 - Sunday",
        date: new Date("2026-02-22T00:00:00"),
        events: [
            {
                id: 29,
                title: "DRONE RACE CHALLENGE",
                location: "DOWNS GROUND",
                coords: { x: 20, y: 20 },
                start: new Date("2026-02-22T09:00:00"),
                end: new Date("2026-02-22T11:00:00"),
                desc: "High-speed FPV drone racing track for professional pilots.",
            },
            {
                id: 30,
                title: "BGMI",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 40, y: 30 },
                start: new Date("2026-02-22T09:00:00"),
                end: new Date("2026-02-22T11:00:00"),
                desc: "Battle Royale survival tournament. Winner takes all.",
            },
            {
                id: 31,
                title: "BUSINESS SIMULATION",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 60, y: 20 },
                start: new Date("2026-02-22T09:00:00"),
                end: new Date("2026-02-22T12:00:00"),
                desc: "Market simulation and strategy game. Dominate the virtual economy.",
            },
            {
                id: 32,
                title: "FLOW FORGE",
                location: "COMPUTER CENTRE",
                coords: { x: 80, y: 30 },
                start: new Date("2026-02-22T09:00:00"),
                end: new Date("2026-02-22T13:00:00"),
                desc: "Fluid dynamics and mechanics challenge for engineering minds.",
            },
            {
                id: 33,
                title: "COZMO CLENCH",
                location: "OPEN AIR THEATRE",
                coords: { x: 80, y: 60 },
                start: new Date("2026-02-22T11:00:00"),
                end: new Date("2026-02-22T13:30:00"),
                desc: "Gripper bot challenge. Robots must pick and place objects with precision.",
            },
            {
                id: 34,
                title: "FINITE ELEMENT ANALYSIS",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 60, y: 70 },
                start: new Date("2026-02-22T12:30:00"),
                end: new Date("2026-02-22T14:30:00"),
                desc: "Engineering design analysis competition using industry-standard software.",
            },
            {
                id: 35,
                title: "LIGHTS, CAMERA, OJASS!",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 40, y: 60 },
                start: new Date("2026-02-22T14:30:00"),
                end: new Date("2026-02-22T16:30:00"),
                desc: "Filmmaking and cinematography showcase under the stars.",
            },

            {
                id: 36,
                title: "ULYSSES",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 20, y: 70 },
                start: new Date("2026-02-22T14:30:00"),
                end: new Date("2026-02-22T16:30:00"),
                desc: "Literary and creative writing event. Unleash the writer within.",
            },
        ],
    },
};
