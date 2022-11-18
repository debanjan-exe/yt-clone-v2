import styled from "styled-components";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import upload from "../assets/animations/upload.json";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "react-percent-bar";
import { endpoints } from "../utils/Constants";
import axios from "axios";
import app from "../firebase";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000000a7;
    /* position: fixed; */
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
`;

const Wrapper = styled.div`
    border-radius: 10px;
    width: 600px;
    height: 650px;
    background-color: ${({ theme }) => theme.bgLighter};
    color: ${({ theme }) => theme.text};
    padding: 20px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    gap: 20px;

    @media only screen and (max-width: 768px) {
        margin: 0px 10px;
    }
`;

const UploadScreen = styled.div`
    padding-top: 100px;
    display: flex;
    align-items: center;
    gap: 100px;
    flex-direction: column;
`;

const Close = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;

    &:hover {
        background-color: #2e2e2e;
    }
`;
const Title = styled.h1`
    text-align: center;
    font-weight: 500;
    font-size: 20px;
`;

const Animation = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    /* position: absolute; */
    left: 0;
    top: 20;
    width: 100%;
    height: 200px;
`;

const Button = styled.button`
    background-color: #2e2e2e;
    width: max-content;
    padding: 10px 20px;
    border-radius: 5px;
    color: #fff;
    transition: all 0.1s ease-in-out;

    &:hover {
        background-color: #333;
    }
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 600;
`;

const Input = styled.input`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`;

const Desc = styled.textarea`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`;

const BtnContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const Upload = ({ setOpenUploadModal }) => {
    const [img, setImg] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();
    const toast = useToast();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        document.body.style = "overflow-y:hidden";
        // setImg(undefined);
        // setVideo(undefined);

        return () => {
            document.body.style = "overflow-y: scroll";
        };
    }, []);

    const handleChange = (e) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const UploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                urlType === "imgUrl"
                    ? setImgPerc(Math.round(progress))
                    : setVideoPerc(Math.round(progress));
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => {
                        return { ...prev, [urlType]: downloadURL };
                    });
                });
            }
        );
    };

    useEffect(() => {
        img && UploadFile(img, "imgUrl");
    }, [img]);

    useEffect(() => {
        video && UploadFile(video, "videoUrl");
    }, [video]);

    const handleTags = (e) => {
        setTags(e.target.value.split(","));
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!inputs.title && !inputs.desc) {
            toast({
                title: "Title & Description are required",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
        } else {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: currentUser.access_token,
                    },
                };
                const res = await axios.post(
                    `${endpoints.GET_VIDEOS}`,
                    {
                        ...inputs,
                        tags,
                    },
                    config
                );
                if (res.status === 200) {
                    setOpenUploadModal(false);
                    navigate(`/video/${res.data._id}`);
                }
            } catch (error) {
                toast({
                    title: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-left",
                });
            }
        }
    };

    const handleInputFile = () => {
        document.getElementById("fileInput").click();
    };

    return (
        <Container>
            <Wrapper>
                <Close onClick={() => setOpenUploadModal(false)}>
                    <CloseIcon />
                </Close>
                <Title>Upload a New Video</Title>

                {!video ? (
                    <UploadScreen>
                        <Animation>
                            <Lottie
                                animationData={upload}
                                loop={true}
                                style={{
                                    width: 250,
                                    height: 250,
                                    resizeMode: "contain",
                                }}
                            />
                        </Animation>

                        <Button onClick={handleInputFile}>Select Video</Button>
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                            accept="video/*"
                            onChange={(e) => {
                                if (!e.target.files[0]) {
                                    toast({
                                        title: "Select a video",
                                        status: "error",
                                        duration: 3000,
                                        isClosable: true,
                                        position: "bottom-left",
                                    });
                                } else {
                                    setVideo(e.target.files[0]);
                                }
                            }}
                        />
                    </UploadScreen>
                ) : (
                    <>
                        {videoPerc > 0 && (
                            <>
                                Video Uploaded: {videoPerc}%
                                {videoPerc !== 100 && (
                                    <ProgressBar
                                        colorShift={true}
                                        fillColor="#3ea6ff"
                                        percent={videoPerc}
                                        width="100%"
                                    />
                                )}
                            </>
                        )}

                        <Input
                            type="text"
                            placeholder="Title"
                            name="title"
                            onChange={handleChange}
                        />
                        <Desc
                            placeholder="Description"
                            rows={8}
                            name="desc"
                            onChange={handleChange}
                        />
                        <Input
                            type="text"
                            placeholder="Separate tags with commas."
                            onChange={handleTags}
                        />
                        <Label>Image Thumbnail:</Label>
                        {imgPerc > 0 ? (
                            <>
                                Image Uploaded : {imgPerc}%
                                {imgPerc !== 100 && (
                                    <ProgressBar
                                        colorShift={true}
                                        fillColor="#cc1a00"
                                        percent={imgPerc}
                                        width="100%"
                                    />
                                )}
                            </>
                        ) : (
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImg(e.target.files[0])}
                            />
                        )}
                        <BtnContainer>
                            <Button onClick={handleUpload} disabled={false}>
                                Upload
                            </Button>
                        </BtnContainer>
                    </>
                )}
            </Wrapper>
        </Container>
    );
};

export default Upload;
