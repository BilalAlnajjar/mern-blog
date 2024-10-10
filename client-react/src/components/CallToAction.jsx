import {Button} from "flowbite-react";

function CallToAction() {
    return (
        <div className={"flex flex-col sm:flex-row p-3 border border-teal-500 " +
            "justify-center items-center rounded-tl-3xl rounded-br-3xl text-center"}>
            <div className={"flex-1 flex flex-col justify-center "}>
                <h2 className={"text-2xl"}>Want to learn more about Javascript</h2>
                <p className={"text-gray-500 my-2"}>Checkout these resources with 100 Javascript projects</p>
                <Button gradientDuoTone={"purpleToPink"} className={"rounded-tl-xl rounded-bl-none "}>
                    <a href={"https://www.100jsprojects.com"} target={"_blank"} rel={"noopener noreferrer"}>
                        100 JavaScript projects
                    </a>
                </Button>
            </div>
            <div className={"p-7 flex-1"}>
               <img src={"https://blob.sololearn.com/assets/introduction-javascript-cover.png"} alt={""} />
            </div>
        </div>
    );
}

export default CallToAction;