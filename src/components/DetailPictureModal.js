import ReactDOM from 'react-dom';

const DetailPictureModal = ({isOpen, onClose, image}) => {
    if (!isOpen) return null;
return ReactDOM.createPortal(<div onClick={onClose} className={"fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-10"}>
    <div onClick={(e) => e.stopPropagation()} className={"bg-black bg-opacity-50 flex h-full w-full rounded-md"}>
            <div className={"flex rounded overflow-hidden h-full w-full justify-center items-center"}>
                <img src={`my-scheme-name:///${image}`} className={"w-full h-full"}/>
            </div>
        <div className={"min-w-96"}>
            dsd
        </div>
    </div>
</div>, document.body)
}

export default DetailPictureModal;