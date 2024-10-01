import {useState} from 'react';
import {Link,useNavigate} from "react-router-dom";
import {Alert, Button, Label, Spinner, TextInput} from "flowbite-react";
import OAuth from "../components/OAuth.jsx";

function SignUp() {
    const [formData,setFormData] = useState({})
    const [errorMessage,setErrorMessage] = useState(null)
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const handelChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value.trim()})
    }
    const handelSubmit = async (e) => {
        e.preventDefault()
        if (!formData.username || !formData.email || !formData.password){
            return setErrorMessage("Please fill out all fields")
        }
        try{
            setLoading(true)
            setErrorMessage(null)
            const res = await fetch('/api/auth/signup',{
                method:"POST",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(formData)
            })

            const data = await res.json()
            setLoading(false)
            if(data.success === false){
                return setErrorMessage(data.message)
            }
            if(res.ok){
                navigate("/sign-in")
            }
        }catch (error){
            setErrorMessage(error.message)
            setLoading(false)
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
                    Belal&apos;s</span>Blog
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
                            <Label value={"Your username"}/>
                            <TextInput type={"text"} placeholder={"Username"} id={"username"} onChange={handelChange}/>
                        </div>
                        <div className={""}>
                            <Label value={"Your email"}/>
                            <TextInput type={"email"} placeholder={"name@company.com"} id={"email"} onChange={handelChange}/>
                        </div>
                        <div className={""}>
                            <Label value={"Your password"}/>
                            <TextInput type={"password"} placeholder={"Password"} id={"password"} onChange={handelChange}/>
                        </div>
                        <Button type={"submit"} gradientDuoTone={"purpleToPink"} disabled={loading}>
                            {
                                loading ?<>
                                    <Spinner size={"sm"} />
                                    <span className={"pl-3"}>Loading...</span>
                                </>
                                    : "Sign Up"
                            }
                        </Button>
                        <OAuth />
                    </form>
                    <div className={"flex gap-2 text-sm mt-5"}>
                        <span>Have an a account?</span>
                        <Link to={"/sign-in"} className={"text-blue-500"}>Sign In</Link>
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

export default SignUp;