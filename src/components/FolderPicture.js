import React, {useEffect, useState} from 'react';

const FolderPicture = ({ timestamp }) => {
    const [pictureList, setPictureList] = useState([])

    useEffect(() => {


        console.log(timestamp)
        window.PictureList.requestPicture(timestamp);

        window.PictureList.onReceiveList(timestamp, (list) => {
            setPictureList(list);
            console.log(pictureList)
        });
    }, []);

    return(<>
        <div>
            <label className="font-black font-bold text-xl">{timestamp}</label>
            <div className={"grid grid-cols-3 gap-4"}>
                {pictureList.map((list) => (
                    <div className={"flex items-center justify-center"}>
                        <img
                            src={"my-scheme-name:///" + list} className={"w-full h-full object-cover"} />
                    </div>
                ))}
            </div>

        </div>
    </>)
};

export default FolderPicture;