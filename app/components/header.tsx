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
import Card from "./card";

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
                                            });
                                        }
                                    }).catch((e) => {
                                        modal.openModal({
                                            id: "login-failed",
                                            title: "Login failed",
                                            contentStyle: {
                                                padding: "20px",
                                            },
                                            content: (
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

export function AppHeader({
    user,
}: {
    user: IUser
}) {
    const [loggingIn, setLoggingIn] = useState(true)
    const store = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const useUserProvider = useUser();
    const modal = useModal();
    const [userData, setUserData] = useState<IUser | null>(null);

    useEffect(() => {
        if (loggingIn) {
            fetchUserLogin("test", "test").then(() => {
                setLoggingIn(false);
            })
        }
    }, [])

    const loginModal = () => {
        modal.openModal({
            id: "login",
            title: "Login",
            contentStyle: {
                padding: "20px",
            },
            content: (
                <LoginModal
                    onLogin={(user) => {
                        setUserData(user);
                    }}
                />
            ),
        });
    }

    return <>
        <header>
            <div className={"center"}>
                <div className="left">
                    <Link to="/" className="link">
                        <h1>Own Workshop</h1>
                    </Link>
                </div>
                <div className="right flex">
                    {
                        !store.id && 
                            <Buttons.LiminalButton
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                }}
                                onClick={() => {
                                    loginModal();
                                    // setLoggingIn(true);
                                    // useUserProvider.login("test", "test").then((d) => {
                                    //     setLoggingIn(false);
                                    //     setUserData(d);
                                    // }).catch((e) => {
                                    //     modal.openModal({
                                    //         id: "login-failed",
                                    //         title: "Login failed",
                                    //         contentStyle: {
                                    //             padding: "20px",
                                    //         },
                                    //         content: (
                                    //             <Card>
                                    //                 <div>
                                    //                     <h1>Login failed</h1>
                                    //                     <p>{e.message}</p>
                                    //                 </div>
                                    //             </Card>
                                    //         ),
                                    //     });

                                    //     setLoggingIn(false);
                                    // });
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
                            }}
                            showUsername={false} 
                            showUserModal={true}
                        />
                    }
                </div>
            </div>
        </header>
    </>
}