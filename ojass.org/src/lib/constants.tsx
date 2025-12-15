import { IconType } from "react-icons";
import { BiSolidCalendarEvent } from "react-icons/bi";
import { FaFacebook, FaHome, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
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
    { title: "Instagram", element: FaSquareInstagram },
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
            {
                id: 1,
                title: "OJASS OLYMPIAD",
                location: "LECTURE HALL COMPLEX",
                type: "setup",
                coords: { x: 10, y: 20 },
                start: new Date(t.getTime() - 70 * hour),
                end: new Date(t.getTime() - 68 * hour),
                desc: "The ultimate aptitude test. Challenge your logical and scientific reasoning against the best minds.",
            },
            {
                id: 2,
                title: "HACK DE SCIENCE",
                location: "COMPUTER CENTRE",
                type: "setup",
                coords: { x: 30, y: 15 },
                start: new Date(t.getTime() - 67 * hour),
                end: new Date(t.getTime() - 61 * hour),
                desc: "24-hour hackathon. Build innovative software solutions for real-world scientific problems.",
            },
            {
                id: 3,
                title: "ROBO RUMBLE",
                location: "OPEN AIR THEATRE",
                type: "active",
                coords: { x: 50, y: 30 },
                start: new Date(t.getTime() - 66 * hour),
                end: new Date(t.getTime() - 62 * hour),
                desc: "Clash of metal. Combat robots fight for survival in a high-stakes arena.",
            },
            {
                id: 4,
                title: "CASE STUDY CHALLENGE",
                location: "SEMINAR HALL A",
                type: "setup",
                coords: { x: 70, y: 20 },
                start: new Date(t.getTime() - 65 * hour),
                end: new Date(t.getTime() - 63 * hour),
                desc: "Analyze complex business scenarios and present strategic solutions to industry experts.",
            },
            {
                id: 5,
                title: "SANRACHNA",
                location: "CIVIL DEPT LABS",
                type: "setup",
                coords: { x: 90, y: 30 },
                start: new Date(t.getTime() - 64 * hour),
                end: new Date(t.getTime() - 60 * hour),
                desc: "Structural engineering challenge. Design and build stable structures under constraints.",
            },
            {
                id: 6,
                title: "CHESS",
                location: "INDOOR STADIUM",
                type: "setup",
                coords: { x: 80, y: 60 },
                start: new Date(t.getTime() - 62 * hour),
                end: new Date(t.getTime() - 58 * hour),
                desc: "Strategic warfare on 64 squares. Checkmate your opponents in this classic battle of wits.",
            },
            {
                id: 7,
                title: "PIXEL SYNC",
                location: "DESIGN STUDIO",
                type: "setup",
                coords: { x: 60, y: 50 },
                start: new Date(t.getTime() - 60 * hour),
                end: new Date(t.getTime() - 57 * hour),
                desc: "Digital art competition. Create stunning visuals and designs within a time limit.",
            },
            {
                id: 8,
                title: "RURAL TECH IDEATHON",
                location: "INNOVATION HUB",
                type: "setup",
                coords: { x: 40, y: 60 },
                start: new Date(t.getTime() - 58 * hour),
                end: new Date(t.getTime() - 55 * hour),
                desc: "Innovate for rural India. Ideate solutions for agriculture, healthcare, and education.",
            },
            {
                id: 9,
                title: "KURUKSHETRA QUALIFIERS",
                location: "GAMING ZONE",
                type: "setup",
                coords: { x: 20, y: 50 },
                start: new Date(t.getTime() - 56 * hour),
                end: new Date(t.getTime() - 52 * hour),
                desc: "The e-sports battle begins. Qualifiers for the main gaming championship.",
            },
        ],
    },
    2: {
        title: "Day 2 - Tuesday",
        date: new Date(t.getTime() - 24 * hour),
        events: [
            {
                id: 10,
                title: "TRACE BOT CHALLENGE",
                location: "ROBOTICS ARENA",
                type: "active",
                coords: { x: 10, y: 20 },
                start: new Date(t.getTime() - 22 * hour),
                end: new Date(t.getTime() - 18 * hour),
                desc: "Autonomous line-follower robots race against time and obstacles.",
            },
            {
                id: 11,
                title: "SIMULATION SPRINT",
                location: "CAD LAB",
                type: "active",
                coords: { x: 30, y: 30 },
                start: new Date(t.getTime() - 20 * hour),
                end: new Date(t.getTime() - 17 * hour),
                desc: "High-speed process simulation and modeling contest.",
            },
            {
                id: 12,
                title: "THE GREAT INDIAN MELA",
                location: "MAIN GROUNDS",
                type: "active",
                coords: { x: 50, y: 40 },
                start: new Date(t.getTime() - 18 * hour),
                end: new Date(t.getTime() - 12 * hour),
                desc: "A vibrant showcase of culture, food, crafts, and creativity.",
            },
            {
                id: 13,
                title: "AQUA RACE",
                location: "CAMPUS LAKE",
                type: "active",
                coords: { x: 70, y: 30 },
                start: new Date(t.getTime() - 16 * hour),
                end: new Date(t.getTime() - 13 * hour),
                desc: "Radio-controlled water bots race across the lake surface.",
            },
            {
                id: 14,
                title: "MOCK IPL AUCTION",
                location: "AUDITORIUM",
                type: "active",
                coords: { x: 90, y: 20 },
                start: new Date(t.getTime() - 14 * hour),
                end: new Date(t.getTime() - 10 * hour),
                desc: "Strategic bidding war. Build the dream team with limited virtual budget.",
            },
            {
                id: 15,
                title: "VISHWA CODE MANIA",
                location: "COMPUTER CENTRE",
                type: "active",
                coords: { x: 80, y: 60 },
                start: new Date(t.getTime() - 12 * hour),
                end: new Date(t.getTime() - 8 * hour),
                desc: "Competitive coding marathon. Solve algorithmic challenges against the clock.",
            },
            {
                id: 16,
                title: "UNDER WATER TRACING",
                location: "SWIMMING POOL",
                type: "active",
                coords: { x: 60, y: 70 },
                start: new Date(t.getTime() - 10 * hour),
                end: new Date(t.getTime() - 7 * hour),
                desc: "Underwater autonomous robot navigation and tracing challenge.",
            },
            {
                id: 17,
                title: "FRAMES & TALES",
                location: "EXHIBITION HALL",
                type: "active",
                coords: { x: 40, y: 60 },
                start: new Date(t.getTime() - 8 * hour),
                end: new Date(t.getTime() - 5 * hour),
                desc: "Photography and storytelling exhibition contest.",
            },
            {
                id: 18,
                title: "FC-24",
                location: "GAMING ZONE",
                type: "active",
                coords: { x: 20, y: 50 },
                start: new Date(t.getTime() - 6 * hour),
                end: new Date(t.getTime() - 3 * hour),
                desc: "Virtual football championship using EA Sports FC 24.",
            },
            {
                id: 19,
                title: "KURUKSHETRA FINALS",
                location: "MAIN STAGE",
                type: "active",
                coords: { x: 50, y: 80 },
                start: new Date(t.getTime() - 4 * hour),
                end: new Date(t.getTime() + 1 * hour),
                desc: "The final showdown. Top gamers compete for the championship title.",
            },
        ],
    },
    3: {
        title: "Day 3 - Wednesday",
        date: new Date(t.getTime() + 6 * hour),
        events: [
            {
                id: 20,
                title: "AI HACKATHON",
                location: "AI LABS",
                type: "future",
                coords: { x: 15, y: 25 },
                start: new Date(t.getTime() + 8 * hour),
                end: new Date(t.getTime() + 16 * hour),
                desc: "Building the future. Develop AI models to solve complex datasets.",
            },
            {
                id: 21,
                title: "NO GROUND ZONE",
                location: "DRONE ARENA",
                type: "future",
                coords: { x: 35, y: 15 },
                start: new Date(t.getTime() + 9 * hour),
                end: new Date(t.getTime() + 12 * hour),
                desc: "Drone obstacle course. Pilots maneuver through tight spaces without touching ground.",
            },
            {
                id: 22,
                title: "START UP IDEATHON",
                location: "INCUBATION CENTRE",
                type: "future",
                coords: { x: 55, y: 25 },
                start: new Date(t.getTime() + 10 * hour),
                end: new Date(t.getTime() + 14 * hour),
                desc: "Pitch your billion-dollar idea to investors and industry leaders.",
            },
            {
                id: 23,
                title: "ROBO SOCCER",
                location: "INDOOR COURT",
                type: "future",
                coords: { x: 75, y: 15 },
                start: new Date(t.getTime() + 11 * hour),
                end: new Date(t.getTime() + 15 * hour),
                desc: "Robots playing football. Fast-paced 1v1 and 2v2 bot matches.",
            },
            {
                id: 24,
                title: "VALORANT",
                location: "GAMING ZONE",
                type: "future",
                coords: { x: 85, y: 55 },
                start: new Date(t.getTime() + 12 * hour),
                end: new Date(t.getTime() + 18 * hour),
                desc: "Tactical shooter tournament. 5v5 teams compete for dominance.",
            },
            {
                id: 25,
                title: "CINESCRIPT",
                location: "MEDIA CENTRE",
                type: "future",
                coords: { x: 65, y: 65 },
                start: new Date(t.getTime() + 13 * hour),
                end: new Date(t.getTime() + 16 * hour),
                desc: "Short film making and scriptwriting competition for aspiring fillmmakers.",
            },
            {
                id: 26,
                title: "FIX-IT FIESTA",
                location: "ELECTRONICS LAB",
                type: "future",
                coords: { x: 45, y: 75 },
                start: new Date(t.getTime() + 14 * hour),
                end: new Date(t.getTime() + 17 * hour),
                desc: "Hardware debugging challenge. Diagnose and fix broken electronic circuits.",
            },
            {
                id: 27,
                title: "MAZE MARATHON",
                location: "ROBOTICS LAB",
                type: "future",
                coords: { x: 25, y: 65 },
                start: new Date(t.getTime() + 15 * hour),
                end: new Date(t.getTime() + 18 * hour),
                desc: "Micromouse competition. Autonomous bots solve complex mazes.",
            },
            {
                id: 28,
                title: "THE FORGE",
                location: "AUDITORIUM",
                type: "future",
                coords: { x: 50, y: 45 },
                start: new Date(t.getTime() + 16 * hour),
                end: new Date(t.getTime() + 19 * hour),
                desc: "Mock TATA Crucible Quiz. The ultimate business and cognitive quiz.",
            },
        ],
    },
    4: {
        title: "Day 4 - Thursday",
        date: new Date(t.getTime() + 30 * hour),
        events: [
            {
                id: 29,
                title: "DRONE RACE CHALLENGE",
                location: "SPORTS COMPLEX",
                type: "future",
                coords: { x: 20, y: 20 },
                start: new Date(t.getTime() + 32 * hour),
                end: new Date(t.getTime() + 36 * hour),
                desc: "High-speed FPV drone racing track for professional pilots.",
            },
            {
                id: 30,
                title: "BUSINESS SIMULATION",
                location: "MBA HALL",
                type: "future",
                coords: { x: 40, y: 30 },
                start: new Date(t.getTime() + 33 * hour),
                end: new Date(t.getTime() + 37 * hour),
                desc: "Market simulation and strategy game. Dominate the virtual economy.",
            },
            {
                id: 31,
                title: "FINITE ELEMENT ANALYSIS",
                location: "MECH LAB",
                type: "future",
                coords: { x: 60, y: 20 },
                start: new Date(t.getTime() + 34 * hour),
                end: new Date(t.getTime() + 38 * hour),
                desc: "Engineering design analysis competition using industry-standard software.",
            },
            {
                id: 32,
                title: "COZMO CLENCH",
                location: "ROBOTICS ARENA",
                type: "future",
                coords: { x: 80, y: 30 },
                start: new Date(t.getTime() + 35 * hour),
                end: new Date(t.getTime() + 39 * hour),
                desc: "Gripper bot challenge. Robots must pick and place objects with precision.",
            },
            {
                id: 33,
                title: "LIGHTS, CAMERA, OJASS!",
                location: "OPEN AIR THEATRE",
                type: "future",
                coords: { x: 80, y: 60 },
                start: new Date(t.getTime() + 36 * hour),
                end: new Date(t.getTime() + 40 * hour),
                desc: "Filmmaking and cinematography showcase under the stars.",
            },
            {
                id: 34,
                title: "FLOW FORGE",
                location: "FLUIDS LAB",
                type: "future",
                coords: { x: 60, y: 70 },
                start: new Date(t.getTime() + 37 * hour),
                end: new Date(t.getTime() + 41 * hour),
                desc: "Fluid dynamics and mechanics challenge for engineering minds.",
            },
            {
                id: 35,
                title: "ULYSSES",
                location: "LIBRARY HALL",
                type: "future",
                coords: { x: 40, y: 60 },
                start: new Date(t.getTime() + 38 * hour),
                end: new Date(t.getTime() + 42 * hour),
                desc: "Literary and creative writing event. Unleash the writer within.",
            },
            {
                id: 36,
                title: "BGMI",
                location: "GAMING ZONE",
                type: "future",
                coords: { x: 20, y: 70 },
                start: new Date(t.getTime() + 39 * hour),
                end: new Date(t.getTime() + 43 * hour),
                desc: "Battle Royale survival tournament. Winner takes all.",
            },
        ],
    },
});
