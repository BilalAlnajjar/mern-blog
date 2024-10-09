import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Button, Modal, Table} from "flowbite-react";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import {FaCheck, FaTimes} from "react-icons/fa";

function DashUsers() {
    const {currentUser} = useSelector((state) => state.user);
    const [users, setUsers] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [userIdDelete, setUserIdDelete] = useState("")
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`)
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                    if(data.users.length < 9){
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        if (currentUser.isAdmin) {
            fetchUsers()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = users.length
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
            const data = await res.json()
            console.log(data.users)
            if(res.ok){
                setUsers((prev) => [...prev,...data.users])
                if(data.users.length < 9){
                    setShowMore(false)
                }
            }
        }catch (error) {
            console.log(error.message)
        }
    }
    const handelDeleteUser = async () =>{
        setShowDeleteModal(false)
        try {
            const res = await fetch(`/api/user/delete/${userIdDelete}`,{
                method:"DELETE",
            })

            const data = await res.json()
            if(!res.ok){
                console.log(data.message)
            }else{
                setUsers((prev) => prev.filter((user) => user._id !== userIdDelete))
            }

        }catch (error){
            console.log(error.message)
        }
    }
    console.log(currentUser.isAdmin, users.length)
    return (
        <div className={" w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"}>
            {
                currentUser.isAdmin && users.length > 0 ? (
                    <>
                        <Table hoverable classname={"shadow-md "}>
                            <Table.Head>
                                <Table.HeadCell>Date created</Table.HeadCell>
                                <Table.HeadCell>User image</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Admin</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            {
                                users.map((user) => (
                                    <Table.Body key={user._id}>
                                        <Table.Row className={"bg-white dark:bg-gray-800 dark:border-gray-700"}>
                                            <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                            <Table.Cell>
                                                    <img src={user.profilePicture} alt={user.username}
                                                         className={"w-10 h-10 object-cover bg-gray-500 rounded-full"}
                                                    />
                                            </Table.Cell>
                                            <Table.Cell>
                                              {user.username}
                                            </Table.Cell>
                                            <Table.Cell>{user.email}</Table.Cell>
                                            <Table.Cell>{user.isAdmin ? (<FaCheck className={"text-green-500"}/>) : (<FaTimes className={"text-red-500"} />)}</Table.Cell>
                                            <Table.Cell>
                                                <span onClick={() => {
                                                    setShowDeleteModal(true)
                                                    setUserIdDelete(user._id)
                                                }
                                                } className={"font-medium text-red-500 hover:underline cursor-pointer"}>
                                                    Delete
                                                </span>
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                ))
                            }
                        </Table>
                        {
                            showMore && (
                                <button onClick={handleShowMore} className={"w-full text-teal-500 self-center text-sm py-7"}>
                                    Show More
                                </button>
                            )
                        }
                    </>
                ) : (
                    <p className={"text-center"}>You have no user yet !</p>
                )
            }
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size={'md'}>
                <Modal.Header/>
                <Modal.Body>
                    <div className={"text-center"}>
                        <HiOutlineExclamationCircle className={"h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto"}/>
                        <h3 className={"mb-5 text-lg text-gray-700 dark:text-gray-400 font-semibold"}>Are you sure you
                            want to delete this user ?</h3>
                        <div className={"flex justify-center gap-4"}>
                            <Button color={"failure"} onClick={handelDeleteUser}>Yes, I&apos;m sure</Button>
                            <Button color={"gray"} onClick={() => setShowDeleteModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DashUsers;