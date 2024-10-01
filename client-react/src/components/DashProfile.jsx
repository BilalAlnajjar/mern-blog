import {useDispatch, useSelector} from "react-redux";
import {Alert, Button, Modal, TextInput} from "flowbite-react";
import {useEffect, useRef, useState} from "react";
import {getStorage,ref,uploadBytesResumable,getDownloadURL} from "firebase/storage";
import {app} from "../firebase.js"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    deleteUserFailure,
    deleteUserStart, deleteUserSuccess, signoutSuccess,
    updateFailure,
    updateStart,
    updateSuccess
} from "../redux/user/userSlice.js";
import {HiOutlineExclamationCircle} from "react-icons/hi";


function DashProfile() {
    const {currentUser,error} = useSelector((state) => state.user)
    const [imageFile,setImageFile] = useState(null)
    const [imageFileUrl,setImageFileUrl] = useState(null)
    const filePickerRef = useRef()
    const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError,setImageFileUploadError] = useState(null)
    const [imageFileUploading,setImageFileUploading] = useState(false)
    const [updateUserSuccess,setUpdateUserSuccess] = useState(null)
    const [updateUserError,setUpdateUserError] = useState(null)
    const [showModal,setShowModal] = useState(false)
    const [formData,setFormData] = useState({})
    const dispatch = useDispatch()

    const handelImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))

        }
    }
    useEffect(() => {
        if(imageFile){
            uploadImage()
        }
    },[imageFile])



    const uploadImage = async () => {
    //     service firebase.storage {
    //         match /b/{bucket}/o {
    //         match /{allPaths=**} {
    //             allow read;
    //             allow write: if
    //                 request.resource.size < 2 * 1024 * 1024 &&
    //                 request.resource.contentType.matches('image/.*')
    //         }
    //     }
    // }
        setImageFileUploading(true)
        setImageFileUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage,fileName)
        const uploadTark = uploadBytesResumable(storageRef,imageFile)

        uploadTark.on(
            'state_changed',
            (snapshot) =>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageFileUploadProgress(progress.toFixed(0))
            },
            () => {
                setImageFileUploadError("could not upload image (File must be less than 2MB)")
                setImageFileUploadProgress(null)
                setImageFile(null)
                setImageFileUrl(null)
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTark.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL)
                    setFormData({...formData,profilePicture:downloadURL})
                    setImageFileUploading(false)
                })
            }
        )
    }

    const handelChange = (e) => {
        setFormData({...formData,[e.target.id]:e.target.value})
    }
    const handelSubmit = async (e) =>{
        e.preventDefault()
        setUpdateUserSuccess(null)
        setUpdateUserError(null)
        if(Object.keys(formData).length === 0){
            setUpdateUserError("No changes made")
            return;
        }
        if(imageFileUploading){
            setUpdateUserError("Please wait for image upload")
            return ;
        }
        try {
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
                method:"PUT",
                headers:{
                    "Content-Type": 'application/json',
                },
                body:JSON.stringify(formData)
            })
            const data = await res.json()

            if(!res.ok){
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)
            }else{
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User's profile updated successfully")
            }
        }catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message)
        }
    }

    const handelDeleteUser = async () =>{
        setShowModal(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                method:"DELETE"
            })
            const data = await res.json()
            if(!res.ok){
                dispatch(deleteUserFailure(data.message))
            }else{
                dispatch(deleteUserSuccess(data))
            }
        }catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }
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
    console.log(formData)
    return (
        <div className={"max-w-lg mx-auto p-3 w-full"}>
            <h1 className={"my-7 text-center font-semibold text-3xl"}>Profile</h1>
            <form onSubmit={handelSubmit} className={"flex flex-col gap-4"}>
                <input type={"file"} hidden accept={"image/*"} ref={filePickerRef} onChange={handelImageChange} />
                <div className={"w-32 h-32 relative self-center cursor-pointer shadow-md overflow-hidden rounded-full"}
                onClick={() => filePickerRef.current.click()}
                >
                    {
                        imageFileUploadProgress && (
                            <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width:"100%",
                                    height:"100%",
                                    position:"absolute",
                                    top:0,
                                    left:0,
                                },
                                path: {
                                    stroke:`rgba(62,152,199,${imageFileUploadProgress /100})`,
                                }
                            }}
                            />
                        )
                    }
                    <img src={imageFileUrl || currentUser.profilePicture} alt={"user"}
                         className={`rounded-full w-full h-full border-[6px] object-cover border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}/>
                </div>
                {
                    imageFileUploadError && (
                        <Alert color={"failure"}>{imageFileUploadError}</Alert>
                    )
                }
                <TextInput type={"text"} id={"username"} onChange={handelChange} placeholder={"username"} defaultValue={currentUser.username}/>
                <TextInput type={"email"} id={"email"} onChange={handelChange} placeholder={"email"} defaultValue={currentUser.email}/>
                <TextInput type={"password"} id={"password"} onChange={handelChange} placeholder={"**********"}/>
                <Button type={"submit"} gradientDuoTone={"purpleToBlue"} outline>
                    Update
                </Button>
            </form>
            <div className={"text-red-500 flex justify-between mt-5"}>
                <span onClick={() => setShowModal(true)} className={"cursor-pointer"}>Delete Account</span>
                <span onClick={handelSignout} className={"cursor-pointer"}>Sign out</span>
            </div>
            {
                updateUserSuccess && (
                    <Alert color={"success"} className={"mt-5"}>
                        {updateUserSuccess}
                    </Alert>
                )
            }

            {
                updateUserError && (
                    <Alert color={"failure"} className={"mt-5"}>
                        {updateUserError}
                    </Alert>
                )
            }
            {
                error && (
                    <Alert color={"failure"} className={"mt-5"}>
                        {error}
                    </Alert>
                )
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
                <Modal.Header />
                <Modal.Body>
                    <div className={"text-center"}>
                        <HiOutlineExclamationCircle className={"h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto"}/>
                        <h3 className={"mb-5 text-lg text-gray-700 dark:text-gray-400 font-semibold"}>Are you sure you want to delete your account ?</h3>
                        <div className={"flex justify-center gap-4"}>
                            <Button color={"failure"} onClick={handelDeleteUser}>Yes, I&apos;m sure</Button>
                            <Button color={"gray"}  onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DashProfile;