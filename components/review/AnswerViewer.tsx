
"use client";

import { useEffect, useRef, useState } from "react";
import { AnswerRegion, StudentAnswer } from "@/types/assessment";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Minus, Plus } from "lucide-react";

interface AnswerViewerProps {
    answer: StudentAnswer | undefined;
}

export default function AnswerViewer({
    answer,
}: AnswerViewerProps) {
    const { answerSheetPages } = useAssessmentStore();

    const [zoom, setZoom] = useState(.7);
    const [currentPage, setCurrentPage] = useState(1);

    const viewerRef = useRef<HTMLDivElement>(null);

    const totalPages = answerSheetPages.length;

    /*
     * Store references to every page.
     *
     * We use these to determine which page is currently
     * closest to the top of the scroll container.
     */
    const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

    /*
     * When the selected question changes,
     * scroll to the page containing its answer.
     */
    useEffect(() => {
    if (!answer?.regions?.length) return;

    const firstRegion = answer.regions[0];
    const pageElement = pageRefs.current[firstRegion.page];
    const container = viewerRef.current;

    if (!pageElement || !container) return;

    const containerRect = container.getBoundingClientRect();
    const pageRect = pageElement.getBoundingClientRect();

    /*
     * Region's vertical position within the page,
     * converted from Gemini's 0-1000 normalized scale
     * into actual rendered pixels for this page.
     */
    const regionTopWithinPage =
        (firstRegion.y / 1000) * pageRect.height;

    /*
     * Where the page currently sits relative to the
     * container's scrollable content.
     */
    const pageOffsetInContainer =
        pageRect.top - containerRect.top + container.scrollTop;

    /*
     * Leave some breathing room above the region instead
     * of pinning it flush to the top of the viewer.
     */
    const topPadding = 80;

    const targetScrollTop =
        pageOffsetInContainer + regionTopWithinPage - topPadding;

    container.scrollTo({
        top: Math.max(targetScrollTop, 0),
        behavior: "smooth",
    });

    setCurrentPage(firstRegion.page);
}, [answer]);

    /*
     * Track the page currently closest to the top
     * of the scrollable viewer.
     *
     * This is intentionally based on getBoundingClientRect()
     * of the PAGE itself, not the bounding boxes.
     */
    useEffect(() => {
        const container = viewerRef.current;

        if (!container) return;

        const handleScroll = () => {
            const containerRect = container.getBoundingClientRect();

            let closestPage = 1;
            let smallestDistance = Infinity;

            Object.entries(pageRefs.current).forEach(
                ([pageNumber, element]) => {
                    if (!element) return;

                    const rect = element.getBoundingClientRect();

                    /*
                     * Distance between the top of the page
                     * and the top of the visible viewer.
                     */
                    const distance = Math.abs(
                        rect.top - containerRect.top
                    );

                    if (distance < smallestDistance) {
                        smallestDistance = distance;
                        closestPage = Number(pageNumber);
                    }
                }
            );

            setCurrentPage(closestPage);
        };

        handleScroll();

        container.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [answerSheetPages, zoom]);

    const zoomIn = () => {
        setZoom((prev) =>
            Math.min(Number((prev + 0.1).toFixed(1)), 2)
        );
    };

    const zoomOut = () => {
        setZoom((prev) =>
            Math.max(Number((prev - 0.1).toFixed(1)), 0.5)
        );
    };

    return (
        <div className="h-full min-h-0 bg-neutral-200 rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="shrink-0 px-5 py-4 bg-neutral-800 text-white flex justify-between items-center">
                <h2 className="font-semibold">
                    Answer Sheet
                </h2>

                <div className="flex items-center gap-3">
                    {/* Zoom */}
                    <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={zoomOut}
                            disabled={zoom <= 0.5}
                            className="p-2 hover:bg-white/10 disabled:opacity-40"
                        >
                            <Minus size={16} />
                        </button>

                        <span className="px-3 text-sm font-medium min-w-[55px] text-center">
                            {Math.round(zoom * 100)}%
                        </span>

                        <button
                            type="button"
                            onClick={zoomIn}
                            disabled={zoom >= 2}
                            className="p-2 hover:bg-white/10 disabled:opacity-40"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* Page */}
                    <div className="text-sm text-white/70">
                        Page {currentPage} of {totalPages}
                    </div>
                </div>
            </div>

            {/* Scrollable document */}
            <div
                ref={viewerRef}
                className="flex-1 min-h-0 overflow-auto p-6"
            >
                <div className="flex flex-col items-center gap-6">
                    {answerSheetPages.map((page, index) => {
                        const pageNumber = index + 1;

                        return (
                            <DocumentPage
                                key={pageNumber}
                                image={page}
                                pageNumber={pageNumber}
                                zoom={zoom}
                                regions={
                                    answer?.regions?.filter(
                                        (region) =>
                                            region.page === pageNumber
                                    ) ?? []
                                }
                                pageRef={(element) => {
                                    pageRefs.current[pageNumber] =
                                        element;
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}


function DocumentPage({
    image,
    pageNumber,
    zoom,
    regions,
    pageRef,
}: {
    image: string;
    pageNumber: number;
    zoom: number;
    regions: AnswerRegion[];
    pageRef: (element: HTMLDivElement | null) => void;
}) {

    const [imageLoaded, setImageLoaded] = useState(false);

    const [naturalDimensions, setNaturalDimensions] =
        useState({
            width: 0,
            height: 0,
        });

    const handleImageLoad = (
        e: React.SyntheticEvent<HTMLImageElement>
    ) => {
        const img = e.currentTarget;
        setNaturalDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
        });
        setImageLoaded(true);
    };

    /*
     * Base width of the document at 100% zoom.
     * Capped so it never overflows the viewer on
     * narrow screens, but can grow past it with zoom.
     */
    const baseWidth = 768;
    const renderedWidth = baseWidth * zoom;

    return (
        <div
            ref={pageRef}
            data-page={pageNumber}
            className="relative shrink-0 bg-white shadow-md"
            style={{
                width: `${renderedWidth}px`,
            }}
        >
            <img
                src={image}
                alt={`Answer sheet page ${pageNumber}`}
                onLoad={handleImageLoad}
                className="block w-full h-auto"
            />

            {imageLoaded &&
                naturalDimensions.width > 0 &&
                regions.map((region, index) => {

                    const left = (region.x / 1000) * 100;
                    const top = (region.y / 1000) * 100;
                    const width = (region.width / 1000) * 100;
                    const height = (region.height / 1000) * 100;

                    return (
                        <div
                            key={`${pageNumber}-${index}`}
                            className="absolute border-2 border-green-500 bg-green-400/10 rounded-sm pointer-events-none"
                            style={{
                                left: `${left}%`,
                                top: `${top}%`,
                                width: `${width}%`,
                                height: `${height}%`,
                            }}
                        />
                    );
                })}
        </div>
    );
}
