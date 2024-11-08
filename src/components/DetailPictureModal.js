import ReactDOM from 'react-dom';
import {useEffect, useState} from "react";

const DetailPictureModal = ({isOpen, onClose, path}) => {
    const [tags, setTags] = useState(null);



    const getMetadata = () => {
        window.PictureProcessing.requestMetadata(path);
        window.PictureProcessing.responseMetadata((data) => {
            console.log(tags)
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
        {
            tags ? (
                <div className={"min-w-96 max-w-96 text-white flex flex-col gap-2"} onClick={(e) => e.stopPropagation()}>
                    <div className={"flex h-56 w-full justify-center items-center overflow-hidden rounded-md"}>
                        <img src={tags.world.thumb} className={"object-fill w-full"}/>
                    </div>
                    <div>
                        <label className={"font-bold text-2xl"}>{tags.world.title}</label>
                        <div>
                            {tags.world.description}
                        </div>
                    </div>
                    <div className={"flex gap-2"}>
                        <button className={"w-full bg-black bg-opacity-50 rounded-md p-2"}>웹에서 보기</button>
                        <button className={"w-full bg-black bg-opacity-50 rounded-md p-2"}>주소 복사</button>
                        <button className={"w-full bg-black bg-opacity-50 rounded-md p-2"}>탐색기에서 열기</button>
                    </div>
                </div>
            ) : null
        }
    </div>
    </div>, document.body)
}

export default DetailPictureModal;
