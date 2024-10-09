import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Button, Modal, Table} from "flowbite-react";
import {Link} from "react-router-dom";
import {HiOutlineExclamationCircle} from "react-icons/hi";

function DashPosts() {
    const {currentUser} = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [postIdDelete, setPostIdDelete] = useState("")
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`)
                const data = await res.json()
                if (res.ok) {
                    setUserPosts(data.posts)
                    if(data.posts.length < 9){
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        if (currentUser.isAdmin) {
            fetchPosts()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = userPosts.length
        try {
            const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`)
            const data = await res.json()
            if(res.ok){
                setUserPosts((prev) => [...prev,...data.posts])
                if(data.posts.length < 9){
                    setShowMore(false)
                }
            }
        }catch (error) {
            console.log(error.message)
        }
    }
    const handelDeletePost = async () =>{
        setShowDeleteModal(false)
        try {
            const res = await fetch(`/api/post/deletepost/${postIdDelete}/${currentUser._id}`,{
                method:"DELETE",
            })

            const data = await res.json()
             if(!res.ok){
                 console.log(data.message)
             }else{
                 setUserPosts((prev) => prev.filter((post) => post._id !== postIdDelete))
             }


        }catch (error){
            console.log(error.message)
        }
    }
    console.log(currentUser.isAdmin, userPosts.length)
    return (
        <div className={" w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"}>
            {
                currentUser.isAdmin && userPosts.length > 0 ? (
                    <>
                        <Table hoverable classname={"shadow-md "}>
                            <Table.Head>
                                <Table.HeadCell>Date updated</Table.HeadCell>
                                <Table.HeadCell>Post image</Table.HeadCell>
                                <Table.HeadCell>Post title</Table.HeadCell>
                                <Table.HeadCell>Category</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell>
                                    <span>Edit</span>
                                </Table.HeadCell>
                            </Table.Head>
                            {
                                userPosts.map((post) => (
                                    <Table.Body key={post._id}>
                                        <Table.Row className={"bg-white dark:bg-gray-800 dark:border-gray-700"}>
                                            <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                                            <Table.Cell>
                                                <Link to={`/post/${post.slug}`}>
                                                    <img src={post.image} alt={post.title}
                                                         className={"w-20 h-10 object-cover bg-gray-500"}
                                                    />
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Link className={"font-medium text-gray-900 dark:text-white"} to={`/post/${post.slug}`}>{post.title}</Link>
                                            </Table.Cell>
                                            <Table.Cell>{post.category}</Table.Cell>
                                            <Table.Cell>
                                                <span onClick={() => {
                                                    setShowDeleteModal(true)
                                                    setPostIdDelete(post._id)
                                                }
                                                } className={"font-medium text-red-500 hover:underline cursor-pointer"}>
                                                    Delete
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Link className={"text-teal-500 hover:underline"} to={`/update-post/${post._id}`}>
                                                    <span>Edit</span>
                                                </Link>
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
                    <p className={"text-center"}>You have no posts yet !</p>
                )
            }
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size={'md'}>
                <Modal.Header/>
                <Modal.Body>
                    <div className={"text-center"}>
                        <HiOutlineExclamationCircle className={"h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto"}/>
                        <h3 className={"mb-5 text-lg text-gray-700 dark:text-gray-400 font-semibold"}>Are you sure you
                            want to delete this post ?</h3>
                        <div className={"flex justify-center gap-4"}>
                            <Button color={"failure"} onClick={handelDeletePost}>Yes, I&apos;m sure</Button>
                            <Button color={"gray"} onClick={() => setShowDeleteModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DashPosts;