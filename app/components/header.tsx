import { Link } from "@remix-run/react";
import User from "./user/user";
import { IUser } from "~/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { setUser, fetchUserLogin } from "~/utils/store/user";
import { Buttons } from "./UI/buttons";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import LoadingCircle from "./LoadingCircle";
import { useUser } from "./contexts/user/userProvider";
import { useModal } from "./contexts/modal/modalProvider";
import Card from "./UI/card";

const LoginModal = ({
    onLogin,
}: {
    onLogin?: (user: IUser) => void;
}) => {
    const modal = useModal();
    const useUserProvider = useUser();
    const [loggingIn, setLoggingIn] = useState(false);

    const inputUsername = useRef<HTMLInputElement>(null);
    const inputPassword = useRef<HTMLInputElement>(null);

    return (
        <>
            <h1>Login</h1>
            {
                !loggingIn && (
                    <Card>
                        <div className="flex column">
                            <input ref={inputUsername} type="text" placeholder="Username" />
                            <input ref={inputPassword} type="password" placeholder="Password" />
                            <Buttons.Button
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                }}
                                onClick={() => {
                                    setLoggingIn(true);
                                    useUserProvider.login(
                                        inputUsername.current?.value || "",
                                        inputPassword.current?.value || ""
                                    ).then((data) => {
                                        setLoggingIn(false);
                                        modal.closeModal("login");
                                        if (onLogin) {
                                            onLogin({
                                                id: data.id,
                                                username: data.username,
                                                pfp: data.pfp,
                                                banner: data.banner,
                                                nsfw: data.nsfw,
                                            });
                                        }
                                    }).catch((e) => {
                                        modal.openModal({
                                            id: "login-failed",
                                            title: "Login failed",
                                            contentStyle: {
                                                padding: "20px",
                                            },
                                            content: () => (
                                                <Card>
                                                    <div>
                                                        <h1>Login failed</h1>
                                                        <p>{e.message}</p>
                                                    </div>
                                                </Card>
                                            ),
                                        });

                                        setLoggingIn(false);
                                    });
                                }}
                            >
                                Login
                            </Buttons.Button>
                        </div>
                    </Card>
                )
            }
            {
                loggingIn && (
                    <Card
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                        <LoadingCircle />
                    </Card>
                )
            }
        </>
    )
}

const UserHeaderModal = ({ user }: { user: IUser }) => {


    return (<div>
        <h1>{user.username}</h1>
        <p>{user.id}</p>
    </div>)
}

export function AppHeader({
    user,
}: {
    user: IUser
}) {
    const [loggingIn, setLoggingIn] = useState(false)
    const [showLoginButton, setShowLoginButton] = useState(false)
    const store = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const useUserProvider = useUser();
    const modal = useModal();
    const [userData, setUserData] = useState<IUser | null>(null);

    
    useEffect(() => {
        setLoggingIn(true);
        useUserProvider.loginViaCookie().then((data) => {
            setLoggingIn(false);
            setUserData(data);
        }).catch(() => {
            setLoggingIn(false);
            setShowLoginButton(true);
        });
    }, [])

    const loginModal = () => {
        modal.openModal({
            id: "login",
            title: "Login",
            contentStyle: {
                padding: "20px",
            },
            content: () => (
                <LoginModal
                    onLogin={(user) => {
                        setUserData(user);
                        setShowLoginButton(false);
                    }}
                />
            ),
        });
    }

    return <>
        <header
            style={{
                maxHeight: "200px",
                overflow: "hidden",
            }}
        >
            <div className={"center"}>
                <div className="left">
                    <Link to="/" className="link">
                        <h1>Own Workshop</h1>
                    </Link>
                </div>
                <div className="right flex">
                    {
                        showLoginButton && 
                            <Buttons.LiminalButton
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                }}
                                onClick={() => {
                                    loginModal();
                                }}
                            >
                                Login
                            </Buttons.LiminalButton>
                    }
                    {
                        loggingIn && (
                            <LoadingCircle />
                        )
                    }
                    {
                        userData && <User 
                            data={{
                                pfp: userData.pfp,
                                id: userData.id,
                                username: userData.username,
                                nsfw: userData.nsfw,
                            }}
                            showUsername={false}
                            onClick={() => {
                                modal.openModal({
                                    id: "user-modal",
                                    title: userData.username,
                                    content: (id) => (
                                        <>
                                            <UserHeaderModal user={userData} />
                                            <div className="flex justify-center" style={{marginTop: "20px"}}>
                                                <a className="btn" href={`/user/${userData.id}`}>View workshop</a>
                                                <Buttons.Button
                                                    btnType="DANGER"
                                                    onClick={() => {
                                                        useUserProvider.logout().then(() => {
                                                            setUserData(null);
                                                            setShowLoginButton(true);
                                                            modal.closeModal(id);
                                                        });
                                                    }}
                                                >Logout</Buttons.Button>
                                            </div>
                                        </>
                                    ),
                                    style: {
                                        width: "100%",
                                        height: "100%",
                                        maxWidth: "var(--page-width)",
                                    }
                                })
                            }}
                        />
                    }
                </div>
            </div>
        </header>
    </>
}