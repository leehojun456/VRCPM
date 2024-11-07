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
return ReactDOM.createPortal(<div onClick={onClose} className={"fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-10"}>
    <div onClick={(e) => e.stopPropagation()} className={"bg-black bg-opacity-50 flex h-full w-full rounded-md"}>
            <div className={"flex rounded overflow-hidden h-full w-full justify-center items-center"}>
                <img src={`my-scheme-name:///${path}`} className={"w-full h-full"} onLoad={getMetadata}/>
            </div>
        <div className={"w-96 text-white"}>
            {tags}
        </div>
    </div>
</div>, document.body)
}

export default DetailPictureModal;