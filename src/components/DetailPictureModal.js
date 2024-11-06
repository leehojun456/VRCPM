import ReactDOM from 'react-dom';

const DetailPictureModal = ({isOpen, onClose, image}) => {
    if (!isOpen) return null;
return ReactDOM.createPortal(<div onClick={onClose} className={"fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"}>
    <div onClick={(e) => e.stopPropagation()} className={"inset-0 flex items-center justify-center"}>
        <div className={"flex bg-white p-2 h-full"}>
            <div className={"flex w-96 rounded overflow-hidden"}>
                <img src={`my-scheme-name:///${image}`} className={"w-full"}/>
            </div>
        </div>
    </div>
</div>, document.body)
}

export default DetailPictureModal;