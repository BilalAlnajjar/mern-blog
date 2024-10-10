import {Alert, Button, FileInput, Select, TextInput} from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useEffect, useState} from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {app} from "../firebase.js"
import {CircularProgressbar} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";

function UpdatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)
    const navigate = useNavigate()
    const { postId } = useParams()
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/post/getPosts?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                    setPublishError(data.message);
                    return;
                }
                if (res.ok) {
                    setPublishError(null);
                    setFormData(data.posts[0]);  // تأكد من تحديث البيانات بشكل صحيح
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchPost();
    }, [postId]);


    const handelUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('please select an image')
                return;
            }
            setImageUploadError(null)
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setImageUploadProgress(progress.toFixed(0))

                }, () => {
                    setImageUploadError("Image upload failed")
                    setImageUploadProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null)
                        setImageUploadError(null)
                        setFormData({...formData, image: downloadURL})

                    })
                }
            )
        } catch (error) {
            setImageUploadError("Image upload failed")
            setImageUploadProgress(null)
            console.log(error)
        }
    }

    const handelSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`,{
                method: "PUT",
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if(!res.ok || data.success === false){
                setPublishError(data.message)
                return
            }
            if (res.ok){
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
        }catch (e) {
            setPublishError(e.message)
        }
    }
    return (
        <div className={"p-3 max-w-3xl mx-auto min-h-screen "}>
            <h1 className={"text-center text-3xl my-7 font-semibold"}>Update post</h1>
            <form className={"flex flex-col gap-4"} onSubmit={handelSubmit}>
                <div className={"flex flex-col gap-4 sm:flex-row justify-between"}>
                    <TextInput type={"text"} placeholder={"Title"} required id={'title'}
                               className={"flex-1"}
                               value={formData.title}
                               onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    <Select
                        onChange={(e) => setFormData({...formData,category: e.target.value})}
                        value={formData.category}
                    >
                        <option value={"uncategorized"}>Select a category</option>
                        <option value={"javascript"}>Javascript</option>
                        <option value={"reactjs"}>React.js</option>
                        <option value={"nextjs"}>Next.js</option>
                    </Select>
                </div>
                <div className={"flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3"}>
                    <FileInput type={"file"} accept={"image/*"} onChange={(e) => setFile(e.target.files[0])}/>
                    <Button type={"button"} gradientDuoTone={"purpleToBlue"}
                            size={"sm"} outline onClick={handelUploadImage} disabled={imageUploadProgress}>
                        {

                            imageUploadProgress ? (
                                <div className={"w-16 h-16"}>
                                    <CircularProgressbar value={imageUploadProgress}
                                                         text={`${imageUploadProgress || 0}%`}/>
                                </div>
                            ) : 'Upload image'
                        }
                    </Button>
                </div>
                {
                    imageUploadError && (
                        <Alert color={"failure"}>{imageUploadError}</Alert>
                    )
                }
                {
                    formData.image && (
                        <img src={formData.image} alt={"upload image"} className={"w-full h-72 object-cover"}/>
                    )
                }
                <ReactQuill theme={"snow"}
                            required placeholder={"Write something..."}
                            value={formData.content}
                            className={"h-72 mb-12"}
                            onChange={(value) => {
                                setFormData((prev) => ({ ...prev, content: value }));
                            }}
                />
                <Button type={"submit"} gradientDuoTone={"purpleToPink"}>
                    Update post
                </Button>
                {
                    publishError && <Alert className={"mt-5"} color={"failure"}>{publishError}</Alert>
                }

            </form>
        </div>
    );
}

export default UpdatePost;