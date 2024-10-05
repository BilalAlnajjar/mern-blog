import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import DashSidebar from "../components/DashSidebar.jsx";
import DashProfile from "../components/DashProfile.jsx";
import DashPosts from "../components/DashPosts.jsx";

function Dashboard() {
    const location = useLocation();
    const [tab,setTap] = useState('');
    useEffect(()=> {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if(tabFromUrl){
            setTap(tabFromUrl)
        }
    },[location.search])
    return (
        <div className={"min-h-screen flex flex-col md:flex-row "}>
            {/* Sidebar */}
            <div className={"md:w-56"}>
                <DashSidebar />
            </div>
            {/* Profile */}
                { tab === 'profile' && <DashProfile /> }
                { tab === 'posts' && <DashPosts /> }
        </div>
    );
}

export default Dashboard;