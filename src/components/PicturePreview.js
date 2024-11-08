import React, {useEffect, useState} from "react";
import DetailPictureModal from "./DetailPictureModal.js";

const PicturePreview = ({path}) => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('')
    const [open, setOpen] = useState(false);

    const handleClick = (image) => {
        setSelectedImage(image);
        setOpen(true);
    };

    useEffect(() => {
        setPreviewImage(path)
        window.PictureProcessing.requestResize(path);

        window.PictureProcessing.onReceiveResize(path,(path)=>{
            setPreviewImage(path)
        });
    }, []);

    return(<>
        <div className={"flex items-center justify-center rounded-md overflow-hidden max-h-96 hover:border-2 border-b-blue-500"}>
            <img
                src={previewImage} className={"w-full h-full object-cover"}
                onClick={() => handleClick(path)}/>
        </div>
        <DetailPictureModal isOpen={open} path={selectedImage}
                            onClose={() => setOpen(false)}></DetailPictureModal>
</>)
}

export default PicturePreview