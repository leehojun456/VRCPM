import React, { useEffect, useState, useRef, useCallback } from 'react';
import FolderPicture from "../components/FolderPicture.js";


const MainPage = () => {
    const [folderList, setFolderList] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [pageSize] = useState(1); // 한 번에 보여줄 아이템 수
    const [currentIndex, setCurrentIndex] = useState(0);

    const observerTarget = useRef(null);

    useEffect(() => {
        window.folderList.request();

        window.folderList.onReceiveList((list) => {
            const sortedList = [...list].sort((a, b) => b.localeCompare(a));
            setFolderList(sortedList);
            setDisplayedItems(sortedList.slice(0, pageSize));
            setCurrentIndex(pageSize);
        });
    }, [pageSize]);

    const loadMore = useCallback(() => {
        if (currentIndex >= folderList.length) return;

        const nextItems = folderList.slice(0, currentIndex + pageSize);
        setDisplayedItems(nextItems);
        setCurrentIndex(prev => prev + pageSize);
    }, [currentIndex, folderList, pageSize]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loadMore]);

    return (
        <div className="flex flex-col gap-2 divide-y divide-solid w-full">
            <div className="flex gap-2">
                <input
                    className="border rounded-md w-full h-10 px-3"
                    placeholder="검색"
                />
                <select className="w-24"></select>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => window.folderList.request()}
                >
                    새로고침
                </button>
            </div>

            {displayedItems.map((timestamp) => (
                <FolderPicture key={timestamp} timestamp={timestamp} />
            ))}

            <div
                ref={observerTarget}
                className="h-10 w-full"
            />
        </div>
    );
};

export default MainPage;