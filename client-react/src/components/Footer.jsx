
import {Footer} from "flowbite-react";
import {Link} from "react-router-dom";
import {BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter} from "react-icons/bs";

function FooterComponent() {
    return (
        <Footer container className={"border border-t-8 border-teal-500"}>
            <div className={"w-full max-w-7xl mx-auto"}>
                <div className={"grid w-full justify-between sm:flex md:grid-cols-1"}>
                    <div className={""}>
                        <Link to={"/"}
                              className={"self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"}>
                            <span
                                className={"px-2 py-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white"}>
                            Belalt&apos;s</span>Blog
                        </Link>
                    </div>
                    <div className={"grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6"}>
                        <div className={""}>
                            <Footer.Title title={"About"}/>
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href={"https://www.100jsprojects.com"}
                                    target={'_blank'}
                                    rel={"noopener noreferrer"}
                                >
                                    100 js projects
                                </Footer.Link>
                                <Footer.Link
                                    href={"/about"}
                                    target={'_blank'}
                                    rel={"noopener noreferrer"}
                                >
                                    Belalt&apos;s Blog
                                </Footer.Link>

                            </Footer.LinkGroup>
                        </div>
                        <div className={""}>
                            <Footer.Title title={"Follow us"}/>
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href={"https://www.github.com"}
                                    target={'_blank'}
                                    rel={"noopener noreferrer"}
                                >
                                    Github
                                </Footer.Link>
                                <Footer.Link href={"#"}>
                                    Discord
                                </Footer.Link>

                            </Footer.LinkGroup>
                        </div>
                        <div className={""}>
                            <Footer.Title title={"Legal"}/>
                            <Footer.LinkGroup col>
                                <Footer.Link href={"#"}>
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link href={"#"}>
                                    Terms &amp; condition
                                </Footer.Link>

                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className={"w-full sm:flex sm:items-center sm:justify-between "}>
                    <div>
                        <Footer.Copyright
                            href={"#"}
                            by={"Belal's Blog"}
                            year={new Date().getFullYear()}/>
                    </div>
                    <div className={"flex gap-3 mt-2 sm:justify-center"}>
                        <Footer.Icon icon={BsFacebook} href={"#"}/>
                        <Footer.Icon icon={BsInstagram} href={"#"}/>
                        <Footer.Icon icon={BsTwitter} href={"#"}/>
                        <Footer.Icon icon={BsGithub} href={"#"}/>
                        <Footer.Icon icon={BsDribbble} href={"#"}/>
                    </div>
                </div>
            </div>
        </Footer>);
}

export default FooterComponent;