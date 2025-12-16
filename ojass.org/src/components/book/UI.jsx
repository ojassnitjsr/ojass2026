"use client";

import { atom, useAtom } from "jotai";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";

const pictures = [
    "DSC00966",
    "DSC00983",
    "DSC00680",
    "DSC00933",
    "DSC01011",
    "DSC01040",
    "DSC01064",
    "DSC01071",
];

export const pageAtom = atom(0);
export const pages = [
    {
        front: "book-cover",
        back: pictures[0],
        name: "Cover",
    },
    {
        front: pictures[1],
        back: pictures[2],
        name: "Privacy Policy",
    },
    {
        front: pictures[3],
        back: pictures[4],
        name: "Terms and Conditions",
    },
    {
        front: pictures[5],
        back: pictures[6],
        name: "Shipping Policy",
    },
    {
        front: pictures[7],
        back: "book-back",
        name: "Refund Policy",
    },
];

const toKebabCase = (str) => {
    return str
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .replace(/[\s-]+/g, " ")
        .replace(/\s+/g, "-");
};

export const UI = () => {
    const [page, setPage] = useAtom(pageAtom);
    const searchParams = useSearchParams();

    useEffect(() => {
        const pageParam = searchParams.get("page");
        if (!pageParam) return;

        const normalizedParam = toKebabCase(pageParam);

        const matchedIndex = pages.findIndex(
            (pg) => toKebabCase(pg.name) === normalizedParam,
        );

        if (matchedIndex !== -1) {
            setPage(matchedIndex);
            return;
        }

        if (normalizedParam === "back-cover") setPage(pages.length);
    }, [searchParams, setPage]);

    useEffect(() => {
        const pageName =
            page === pages.length ? "Back Cover" : pages[page]?.name || "Cover";
        const kebabName = toKebabCase(pageName);

        const url = new URL(window.location.href);
        url.searchParams.set("page", kebabName);
        window.history.replaceState(null, "", url.toString());
    }, [page]);

    useEffect(() => {
        const audio = new Audio("/book/audios/page-flip-01a.mp3");
        audio
            .play()
            .catch((e) => console.warn("Initial audio play failed:", e));
    }, [page]);

    return (
        <>
            <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-end flex-col">
                <div className="w-full overflow-auto pointer-events-auto flex justify-center">
                    <div className="overflow-auto grid grid-cols-2 sm:grid-cols-4 place-items-center gap-4 max-w-full p-10 relative">
                        {pages.map((pg, index) => {
                            if (index === 0) return null;
                            return (
                                <button
                                    key={index}
                                    className={`relative border-transparent hover:border-white transition-all duration-300 px-4 py-1 rounded-full text-xs sm:text-base uppercase shrink-0 border ${
                                        index === page
                                            ? "bg-white/90 text-black"
                                            : "bg-black/30 text-white"
                                    }`}
                                    onClick={() => setPage(index)}>
                                    {pg.name}
                                    <Link
                                        href={`/book/textures/${pg.front}.jpg`}
                                        target="_blank"
                                        className="absolute right-0 top-0 m-1">
                                        <FaInfoCircle className="size-3" />
                                    </Link>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </main>
        </>
    );
};
