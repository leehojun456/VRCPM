import React, {useEffect, useState} from 'react';
import ModelNode from "three/src/nodes/accessors/ModelNode.js";
import DetailPictureModal from "./DetailPictureModal.js";

const FolderPicture = ({ timestamp }) => {
    const [pictureList, setPictureList] = useState([])
    const [selectedImage, setSelectedImage] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {


        console.log(timestamp)
        window.PictureList.requestPicture(timestamp);

        const handlePictureUpdate = (data) => {
            // 수신된 데이터에 대해 상태를 업데이트합니다.
            setPictureList(prev => [...prev, data]); // base64로 변환된 이미지 추가
        };

        // 수신 이벤트 등록
        const removeListener = window.PictureList.onReceiveList(timestamp, handlePictureUpdate);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            removeListener(); // 클린업 함수 호출
        };
    }, []);

    const handleClick = (image) => {
        setSelectedImage(image);
        setOpen(true);
    };

    return(<>
        <div>
            <label className="font-black font-bold text-xl">{timestamp}</label>
            <div className={"grid grid-cols-3 gap-4"}>
                {pictureList.map((list) => (
                    <>
                        <div className={"flex items-center justify-center rounded-md overflow-hidden h-96"}>
                            <img
                                src={list.preview} className={"w-full h-full object-cover"}
                                onClick={() => handleClick(list.image)}/>
                        </div>
                    </>
                ))}
            </div>
        </div>
        <DetailPictureModal isOpen={open} image={selectedImage}
                            onClose={() => setOpen(false)}></DetailPictureModal>
    </>)
};

export default FolderPicture;