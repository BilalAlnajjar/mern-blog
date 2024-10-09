import {Sidebar} from "flowbite-react";
import {HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser} from "react-icons/hi";
import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {signoutSuccess} from "../redux/user/userSlice.js";
import {useDispatch, useSelector} from "react-redux";

function DashSidebar() {
    const location = useLocation();
    const [tab, setTap] = useState('');
    const currentUser = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch()
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl) {
            setTap(tabFromUrl)
        }
    }, [location.search])
    const handelSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: "POST",
            })

            const data = res.json()
            if (!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <Sidebar className={"w-full md:w-56"}>
            <Sidebar.Items>
                <Sidebar.ItemGroup className={"flex flex-col gap-1"}>
                    <Link to={"/dashboard?tab=profile"}>
                        <Sidebar.Item as={"div"} active={tab === "profile"} icon={HiUser}
                                      label={currentUser.isAdmin ? "Admin" : "User"} labelColor={'dark'}>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {
                        currentUser.isAdmin &&
                        <>
                            <Link to={"/dashboard?tab=posts"}>
                                <Sidebar.Item as={"div"} active={tab === "posts"} icon={HiDocumentText}>
                                    Posts
                                </Sidebar.Item>
                            </Link>
                            <Link to={"/dashboard?tab=users"}>
                                <Sidebar.Item as={"div"} active={tab === "users"} icon={HiOutlineUserGroup}>
                                    Users
                                </Sidebar.Item>
                            </Link>
                        </>
                    }

                    <Sidebar.Item onClick={handelSignout} icon={HiArrowSmRight} className={"cursor-pointer"}>
                        Sign out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

export default DashSidebar;