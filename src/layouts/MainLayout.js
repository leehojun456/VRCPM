import {Link, Outlet} from "react-router-dom";
import {faList} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const MainLayout = () => {
    return(
        <>
            <div className={"flex"}>
                <div className={"flex flex-col h-dvh bg-gray-50 min-w-16 text-2xl p-4"}>
                    <Link to={"/"} className={''}><FontAwesomeIcon icon={faList} /></Link>
                </div>
                <div className={"h-dvh w-full overflow-x-hidden flex p-2"}>
                    <Outlet></Outlet>
                </div>
            </div>
        </>
    )
}

export default MainLayout