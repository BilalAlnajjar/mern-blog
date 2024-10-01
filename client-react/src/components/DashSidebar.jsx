import {Sidebar} from "flowbite-react";
import {HiArrowSmRight, HiUser} from "react-icons/hi";
import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {signoutSuccess} from "../redux/user/userSlice.js";
import {useDispatch} from "react-redux";

function DashSidebar() {
    const location = useLocation();
    const [tab,setTap] = useState('');
    const dispatch = useDispatch()
    useEffect(()=> {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if(tabFromUrl){
            setTap(tabFromUrl)
        }
    },[location.search])
    const handelSignout = async () =>{
        try{
            const res = await fetch('/api/user/signout',{
                method:"POST",
            })

            const data = res.json()
            if(!res.ok){
                console.log(data.message)
            }else{
                dispatch(signoutSuccess())
            }
        }catch(error) {
            console.log(error.message)
        }
    }
    return (
        <Sidebar className={"w-full md:w-56"}>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to={"/dashboard?tab=profile"}>
                        <Sidebar.Item as={"div"} active={tab === "profile"} icon={HiUser} label={"User"} labelColor={'dark'}>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item onClick={handelSignout} icon={HiArrowSmRight} className={"cursor-pointer"}>
                        Sign out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

export default DashSidebar;