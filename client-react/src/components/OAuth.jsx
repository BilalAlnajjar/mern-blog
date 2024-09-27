import {Button} from "flowbite-react";
import {AiFillGoogleCircle} from "react-icons/ai";
import {GoogleAuthProvider,signInWithPopup,getAuth} from "firebase/auth"
import {app} from "../firebase.js";
import {useDispatch} from "react-redux";
import {signInSuccess} from "../redux/user/userSlice.js";
import {useNavigate} from "react-router-dom";

export default function OAuth()  {
    const dispatch = useDispatch();
    const naveigate = useNavigate()

    const handelGoogleClick = async () => {
        const auth =  getAuth(app);
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt : 'select_account' })

        try {
            const resultsFromGoogle = await signInWithPopup(auth,provider);
            const res = await fetch('/api/auth/google',{
                method:"POST",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    name:resultsFromGoogle.user.displayName,
                    email:resultsFromGoogle.user.email,
                    googlePhotoUrl:resultsFromGoogle.user.photoURL,
                })
            })
            const data = await res.json()
            if(res.ok){
                dispatch(signInSuccess(data))
                naveigate('/')
            }
        }catch (error){
            console.log(error)
        }
    }

    return (
        <Button
            type={"button"}
            gradientDuoTone={"pinkToOrange"}
            outline
            onClick={handelGoogleClick}
        >
            <AiFillGoogleCircle className={"w-6 h-6 mr-2"} />
            Continue with Google
        </Button>
    );
}
