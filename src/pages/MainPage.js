import React, { useEffect, useState, useRef, useCallback } from 'react';
import FolderPicture from "../components/FolderPicture.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsRotate, faList} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {faFolder} from "@fortawesome/free-regular-svg-icons";


const MainPage = () => {
    const [folderList, setFolderList] = useState([]);
    useEffect(() => {
        handleRequest();
    }, []);

    const handleRequest = ()=> {
        window.folder.listRequest();
        window.folder.onReceiveList((list) => {
            const sortedList = [...list].sort((a, b) => b.localeCompare(a));
            setFolderList(sortedList);
        });
    }

    const openFolder = (timestamp) => {
        window.folder.openRequest(timestamp);
        console.log(timestamp)

    }

    return (
        <div className="flex flex-col gap-4 m-2">
            {folderList.map((timestamp) => (
                    <Link to={`/${timestamp}`} className="flex items-center justify-between font-black font-bold text-2xl p-4 shadow-sm rounded border hover:border-blue-500 hover:bg-blue-50">
                        <div>{timestamp}</div>
                        <button onClick={()=>openFolder(timestamp)}>
                            <FontAwesomeIcon icon={faFolder} className={"text-gray-400"}/>
                        </button>
                    </Link>
                )
            )}
        </div>
    );
};

export default MainPage;