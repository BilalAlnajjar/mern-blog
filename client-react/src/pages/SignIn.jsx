import React, {useState} from 'react';
import {Link,useNavigate} from "react-router-dom";
import {Alert, Button, Label, Spinner, TextInput} from "flowbite-react";
import {useDispatch,useSelector} from "react-redux";
import {signInStart,signInSuccess,signInFailure} from "../redux/user/userSlice.js";

function SignIn(props) {
    const [formData,setFormData] = useState({})
    const { loading, error:errorMessage } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const handelChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value.trim()})
    }
    const handelSubmit = async (e) => {
        e.preventDefault()
        if (!formData.email || !formData.password){
            return dispatch(signInFailure("Please fill out all fields"))
        }
        try{
            dispatch(signInStart())
            const res = await fetch('/api/auth/signin',{
                method:"POST",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(formData)
            })

            const data = await res.json()
            if(data.success === false){
                dispatch(signInFailure(data.message))
            }
            if(res.ok){
                dispatch(signInSuccess(data))
                navigate("/")
            }
        }catch (error){
            dispatch(signInFailure(error.message))
        }
    }
    console.log(formData)
    return (
        <div className={"min-h-screen mt-20"}>
            <div className={"flex p-3 max-w-3xl mx-auto flex-col " +
                "md:flex-row md:items-center gap-5"}>
                {/*left side*/}
                <div className={"flex-1"}>
                    <Link to={"/"} className={"text-4xl font-bold dark:text-white"}>
                <span className={"px-2 py-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white"}>
                    Belal's</span>Blog
                    </Link>
                    <p className={"text-sm mt-5 "}>
                        t is a long established fact that a reader will be distracted
                        by the readable content.
                    </p>
                </div>
                {/*right side*/}
                <div className={"flex-1"}>
                    <form className={"flex flex-col gap-4"} onSubmit={handelSubmit}>
                        <div className={""}>
                            <Label value={"Your email"}/>
                            <TextInput type={"email"} placeholder={"name@company.com"} id={"email"} onChange={handelChange}/>
                        </div>
                        <div className={""}>
                            <Label value={"Your password"}/>
                            <TextInput type={"password"} placeholder={"***********"} id={"password"} onChange={handelChange}/>
                        </div>
                        <Button type={"submit"} gradientDuoTone={"purpleToPink"} disabled={loading}>
                            {
                                loading ?<>
                                        <Spinner size={"sm"} />
                                        <span className={"pl-3"}>Loading...</span>
                                    </>
                                    : "Sign In"
                            }
                        </Button>
                    </form>
                    <div className={"flex gap-2 text-sm mt-5"}>
                        <span>Don't Have an account</span>
                        <Link to={"/sign-up"} className={"text-blue-500"}>Sign Up</Link>
                    </div>
                    {
                        errorMessage && (
                            <Alert className={"mt-5"} color={"failure"}>{errorMessage}</Alert>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default SignIn;