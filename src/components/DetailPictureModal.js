import ReactDOM from 'react-dom';
import {useEffect, useState} from "react";

const DetailPictureModal = ({isOpen, onClose, path}) => {
    const [tags, setTags] = useState([]);



    const getMetadata = () => {
        window.PictureProcessing.requestMetadata(path);
        window.PictureProcessing.responseMetadata((data) => {
            setTags(data)
            console.log(data)
        })
    }

    if (!isOpen)
    {
        return null;
    }
return ReactDOM.createPortal(
    <div onClick={onClose} className={"fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-10 backdrop-blur-xl"}>
    <div className={"flex h-full w-full rounded-md gap-12"}>
            <div className={"flex h-full w-full justify-center items-center rounded-md overflow-hidden"}>

                    <img src={`my-scheme-name:///${path}`} className={"h-full object-contain"}
                         onLoad={getMetadata} onClick={(e) => e.stopPropagation()}/>

            </div>
        <div className={"w-96 text-white"}>
            {tags}
        </div>
    </div>
    </div>, document.body)
}

export default DetailPictureModal;