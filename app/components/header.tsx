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
import Icon from "./icons";
import UserHeader from "./user/UserHeader";
import { serverHost } from "~/utils/vars";

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
                                                admin: data.admin,
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


const UserModal = (
    {userData, setShowLoginButton, setUserData}: 
    {userData: IUser, setShowLoginButton: (show: boolean) => void, setUserData: (user: IUser | null) => void}
) => {
    const modal = useModal();
    const dispatch = useAppDispatch();

    return (
        <>
            <UserHeader user={{
                ...userData,
            }} />
            {/* <h1>{userData.username}</h1>
            <p>{userData.id}</p>
             */}
            <div className="flex wrap button-bar" style={{ padding: "20px", gap: "20px", }}>
                <Link style={{ borderRadius: "64px", }} to={`/user/${userData.id}`} className="link">
                    <Buttons.LiminalButton
                        style={{ padding: "12px", borderRadius: "64px", }}
                        onClick={() => { modal.closeModal("user-modal"); }}
                    >
                        <p>View workshop</p>
                    </Buttons.LiminalButton>
                </Link>
                <Link style={{ borderRadius: "64px", }} to={`/account`} className="link">
                    <Buttons.LiminalButton
                        style={{ padding: "10px", borderRadius: "64px", }}
                        onClick={() => { modal.closeModal("user-modal"); }}
                    >
                        <Icon name="account_cog" />
                    </Buttons.LiminalButton>
                </Link>
                <Buttons.LiminalButton
                    style={{ padding: "10px", borderRadius: "64px", }}
                    onClick={() => { 
                        modal.closeModal("user-modal");
                        setUserData(null);
                        setShowLoginButton(true);
                        dispatch(setUser(null));
                    }}
                >
                    <Icon name="logout" />
                </Buttons.LiminalButton>
            </div>
        </>
    )
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

    const userModal = () => {
        if (!userData) return;

        modal.openModal({
            id: "user-modal",
            title: userData?.username || "User",
            style: {
                width: "100%",
                height: "100%",
                maxWidth: "var(--page-width)",
            },
            content: () => (
                <UserModal
                    userData={userData}
                    setShowLoginButton={setShowLoginButton}
                    setUserData={setUserData}
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
                                    padding: "10px",
                                    borderRadius: "64px",
                                }}
                                onClick={() => {
                                    loginModal();
                                }}
                            >
                                <Icon name="login" />
                            </Buttons.LiminalButton>
                    }
                    {
                        loggingIn && (
                            <LoadingCircle />
                        )
                    }
                    {
                        userData && 
                        <div className="flex align-center" style={{gap: "10px"}}>
                            {
                                userData.admin && (
                                    <Link style={{
                                        borderRadius: "64px",
                                    }} to="/admin" className="link">
                                    <Buttons.LiminalButton
                                        style={{
                                            padding: "10px",
                                            borderRadius: "64px",
                                        }}
                                        onClick={() => {
                                        }}
                                    >
                                        <Icon name="security" />
                                    </Buttons.LiminalButton>
                                    </Link>
                                )
                            }
                            <div>
                                <User 
                                    data={{
                                        ...userData,
                                    }}
                                    showUsername={false}
                                    onClick={() => {
                                        userModal()
                                    }}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </header>
    </>
}