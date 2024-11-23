import {Link, NavLink, Outlet} from "react-router-dom";
import {faCircleInfo, faGear, faList} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage} from "@fortawesome/free-regular-svg-icons";

const MainLayout = () => {
    return(
        <>
            <div className={"flex"}>
                <div className={"flex flex-col h-dvh bg-gray-50 min-w-32 text-2xl p-1 justify-between"}>
                    <div className={"flex flex-col gap-2"}>
                        <NavLink to={"/"} className={(({isActive}) => isActive ? "flex gap-4 items-center bg-white h-12 p-2 shadow-sm rounded border" : "flex gap-4 items-center h-12 p-2" )}>
                            <FontAwesomeIcon icon={faList} />
                            <div className={"text-sm"}>리스트</div>
                        </NavLink>
                        <NavLink to={"/edit"} className={(({isActive}) => isActive ? "flex gap-4 items-center bg-white h-12 p-2 shadow-sm rounded border" : "flex gap-4 items-center h-12 p-2" )}>
                            <FontAwesomeIcon icon={faImage} />
                            <div className={"text-sm"}>편집</div>
                        </NavLink>
                    </div>
                    <div className={"flex flex-col gap-2"}>
                        <NavLink to={"/setting"} className={(({isActive}) => isActive ? "flex gap-4 items-center bg-white h-12 p-2 shadow-sm rounded border" : "flex gap-4 items-center h-12 p-2" )}>
                            <FontAwesomeIcon icon={faGear} />
                            <div className={"text-sm"}>설정</div>
                        </NavLink>
                        <NavLink to={"/info"} className={(({isActive}) => isActive ? "flex gap-4 items-center bg-white h-12 p-2 shadow-sm rounded border" : "flex gap-4 items-center h-12 p-2" )}>
                            <FontAwesomeIcon icon={faCircleInfo} />
                            <div className={"text-sm"}>정보</div>
                        </NavLink>
                    </div>
                </div>
                <div className={"overflow-hidden overflow-y-scroll h-dvh w-full"}>
                    <Outlet></Outlet>
                </div>
            </div>
        </>
    )
}

export default MainLayout