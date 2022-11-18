import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { endpoints } from "../utils/Constants";

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.bg};
    height: 93.5vh;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #1b1b1b;
    border: 1px solid ${({ theme }) => theme.soft};
    padding: 50px 70px;
    gap: 10px;
    border-radius: 5px;

    @media only screen and (max-width: 768px) {
        padding: 50px 50px;
    }
`;

const Title = styled.h1`
    font-size: 24px;
    color: #3ea6ff;
`;

const SubTitle = styled.h2`
    font-size: 20px;
    font-weight: 300;
`;

const Input = styled.input`
    padding: 10px;
    border-radius: 3px;
    border: 1px solid ${({ theme }) => theme.soft};
    outline: none;
    width: 100%;
    background-color: transparent;
    color: ${({ theme }) => theme.textSoft};

    &:focus {
        border: 1px solid #006ac4;
    }
`;

const Button = styled.button`
    border-radius: 3px;
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    font-weight: 500;
    background-color: ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.textSoft};
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #545454;
    }
`;

const GButton = styled.button`
    display: flex;
    align-items: center;
    gap: 5px;
    border-radius: 3px;
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    font-weight: 500;
    background-color: #3ea6ff;
    transition: all 0.2s ease-in-out;
    color: #fff;

    &:hover {
        background-color: #006ac4;
    }
`;

const SignUpText = styled.p`
    width: max-content;
    font-size: 14px;
`;
const SignUpBtn = styled.span`
    font-weight: 500;
    color: #006ac4;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const Span = styled.span`
    padding: 1px;
    width: 100%;
    font-size: 14px;
`;

const SignInPage = () => {
    const [showSignIn, setShowSignIn] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [img, setImg] = useState("");
    const { currentUser } = useSelector((state) => state.user);
    const toast = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogin = async (e) => {
        dispatch(loginStart());
        try {
            const res = await axios.post(`${endpoints.SIGNIN}`, {
                email,
                password,
            });

            console.log(res);
            dispatch(loginSuccess(res.data));
            navigate("/");
        } catch (error) {
            toast({
                title: error.response.data.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
            dispatch(loginFailure());
            console.log(error.response.data.message);
        }
    };

    const signInWithGoogle = async () => {
        dispatch(loginStart());
        signInWithPopup(auth, provider)
            .then((result) => {
                axios
                    .post(`${endpoints.G_SIGNIN}`, {
                        name: result.user.displayName,
                        email: result.user.email,
                        img: result.user.photoURL,
                    })
                    .then((res) => {
                        // console.log(res.data);
                        dispatch(loginSuccess(res.data));
                        navigate("/");
                    });
            })
            .catch((error) => {
                toast({
                    title: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-left",
                });
                console.log(error.message);
                dispatch(loginFailure());
            });
    };

    const handleSignUp = async (e) => {
        dispatch(loginStart());

        try {
            const res = await axios.post(`${endpoints.SIGNUP}`, {
                name,
                email,
                password,
                img,
            });
            // console.log(res.data);
            dispatch(loginSuccess(res.data));
            toast({
                title: "Login Successfull",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
            navigate("/");
        } catch (error) {
            dispatch(loginFailure());
            toast({
                title: error.response.data.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
            console.log(error.response.data.message);
        }
    };

    const uploadProfileImg = (pics) => {
        if (pics === undefined) {
            toast({
                title: "Please Select an image1",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
            return;
        } else {
            if (pics.type === "image/jpeg" || pics.type === "image/png") {
                const data = new FormData();
                data.append("file", pics);
                data.append("upload_preset", "yt-clone");
                data.append("cloud_name", "debanjan");
                fetch("https://api.cloudinary.com/v1_1/debanjan/image/upload", {
                    method: "post",
                    body: data,
                })
                    .then((res) => res.json())
                    .then((data) => {
                        setImg(data.url.toString());
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                toast({
                    title: "Please Select an Image",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom",
                });
                return;
            }
        }
    };

    return (
        <Container>
            <Wrapper>
                <Title>{showSignIn ? "Sign Up" : "Sign In"}</Title>
                <SubTitle>to continue to YouTube</SubTitle>
                {!showSignIn && (
                    <>
                        <Input
                            placeholder="email"
                            type="text"
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleLogin();
                                }
                            }}
                        />
                        <Input
                            placeholder="password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleLogin();
                                }
                            }}
                        />
                        <Button onClick={handleLogin}>Sign In</Button>
                        <h5>or</h5>
                        <GButton onClick={signInWithGoogle}>
                            <GoogleIcon />
                            Sign In With Google
                        </GButton>
                        <SignUpText>
                            Not Registered ! Try{" "}
                            <SignUpBtn onClick={() => setShowSignIn(true)}>
                                Sign up
                            </SignUpBtn>
                        </SignUpText>
                    </>
                )}
                {showSignIn && (
                    <>
                        <Input
                            placeholder="name"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            placeholder="email"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <>
                            <Span>Choose Profile Picture :</Span>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    uploadProfileImg(e.target.files[0])
                                }
                            />
                        </>

                        <Button onClick={handleSignUp}>Sign Up</Button>
                        <SignUpText>
                            Already Registered ! Try{" "}
                            <SignUpBtn onClick={() => setShowSignIn(false)}>
                                Sign in
                            </SignUpBtn>
                        </SignUpText>
                    </>
                )}
            </Wrapper>
        </Container>
    );
};

export default SignInPage;
