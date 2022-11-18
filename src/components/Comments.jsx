import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { endpoints } from "../utils/Constants";
import SortIcon from "@mui/icons-material/Sort";
import { useSelector } from "react-redux";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import Picker from "emoji-picker-react";
import Comment from "./Comment";

const Container = styled.div`
    /* width: 100%; */
`;

const CommDetails = styled.div`
    color: #fff;
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
    align-items: center;
`;

const Noofcomm = styled.span``;

const SortAction = styled.span`
    display: flex;
    align-items: center;
    font-weight: 500;
    gap: 5px;
    user-select: none;
    cursor: pointer;
    position: relative;
`;

const SortMenu = styled.div`
    z-index: 1;
    position: absolute;
    background-color: ${({ theme }) => theme.bgLighter};
    bottom: -100px;
    /* right: px; */
    width: max-content;
    font-weight: normal;
    gap: 3px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.09);
    -moz-box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.09);
    box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.09);
    display: flex;
    flex-direction: column;
`;

const MenuItem = styled.span`
    border-radius: 5px;
    padding: 10px 20px;
    &:hover {
        background-color: ${({ theme }) => theme.soft};
    }
`;

const NewComment = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    position: relative;
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

const InputContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    color: ${({ theme }) => theme.text};
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.soft};
    background-color: transparent;
    padding: 5px;
    outline: none;
    /* width: 100%; */
    font-size: 16px;
    transition: all 0.3s ease-in-out;

    &:focus {
        border-bottom: 1.5px solid ${({ theme }) => theme.text};
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
`;

const EmojiBtn = styled.div`
    cursor: pointer;
    color: ${({ theme }) => theme.text};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 5px;
    transition: all 0.1s ease-in-out;

    &:hover {
        background-color: ${({ theme }) => theme.soft};
        /* color: ${({ theme }) => theme.text}; */
    }
`;

const Btns = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
    cursor: pointer;
`;

const CText = styled.p`
    color: ${({ theme }) => theme.text};
    transition: all 0.1s ease-in-out;
    font-weight: 500;
    padding: 10px 20px;
    /* background-color: #3ea6ff; */
    border-radius: 30px;
    font-size: 14px;
    transition: all 0.1s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: ${({ theme }) => theme.soft};
        /* color: ${({ theme }) => theme.text}; */
    }
`;

const Button = styled.button`
    border-radius: 30px;
    font-weight: 500;
    background-color: #3ea6ff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    transition: all 0.1s ease-in-out;

    &:hover {
        background-color: #7dc3ff;
    }
`;

const PickerContainer = styled.div`
    position: absolute;
    top: 470px;
    /* left: 0; */
`;

const Comments = ({ videoId }) => {
    const [comments, setComments] = useState([]);
    const [update, setUpdate] = useState(false);
    const [sort, setSort] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [currentUserComment, setCurrentUserComment] = useState("");
    const [pickerShow, setPickerShow] = useState(false);
    const [showBtn, setShowBtn] = useState(false);

    const refOne = useRef(null);
    const refInput = useRef(null);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${endpoints.GET_COMMENTS}/${videoId}`);
            setComments(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId, update]);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickOutside = (e) => {
        if (refInput.current.contains(e.target)) {
            if (currentUser) {
                setShowBtn(true);
            }
        }
        if (!refOne.current.contains(e.target)) {
            setSort(false);
        }
    };

    const sortByTime = async () => {
        try {
            const res = await axios.get(
                `${endpoints.GET_COMMENTS}/${videoId}?sort=new`
            );
            setComments(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePostComment = async () => {
        if (currentUserComment) {
            if (currentUser) {
                try {
                    const response = await axios.post("/api/comments/", {
                        videoId,
                        desc: currentUserComment,
                    });
                    setComments([response.data, ...comments]);
                    setCurrentUserComment("");
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    const onEmojiClick = (e) => {
        setCurrentUserComment((prevText) => prevText + e.emoji);
    };

    return (
        <Container>
            <CommDetails>
                <Noofcomm>{comments.length} Comments</Noofcomm>
                <SortAction ref={refOne} onClick={() => setSort(!sort)}>
                    <SortIcon />
                    Sort by
                    {sort && (
                        <SortMenu>
                            <MenuItem onClick={fetchComments}>
                                Top Comments
                            </MenuItem>
                            <MenuItem onClick={sortByTime}>
                                Newest First
                            </MenuItem>
                        </SortMenu>
                    )}
                </SortAction>
            </CommDetails>
            <NewComment>
                <Avatar
                    src={
                        currentUser
                            ? currentUser.img
                            : "https://res.cloudinary.com/debanjan/image/upload/v1667971010/user_yz3ysi.png"
                    }
                />

                <InputContainer>
                    <Input
                        placeholder="Add a comment..."
                        value={currentUserComment}
                        onChange={(e) => {
                            setPickerShow(false);
                            setCurrentUserComment(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handlePostComment();
                            }
                        }}
                        ref={refInput}
                    />

                    {showBtn && (
                        <ButtonContainer>
                            <EmojiBtn
                                onClick={() => setPickerShow(!pickerShow)}
                            >
                                <TagFacesIcon />
                            </EmojiBtn>

                            <Btns>
                                <CText
                                    onClick={() => {
                                        setCurrentUserComment("");
                                        setShowBtn(false);
                                    }}
                                >
                                    cancel
                                </CText>
                                <Button onClick={handlePostComment}>
                                    Comment
                                </Button>
                            </Btns>
                        </ButtonContainer>
                    )}
                </InputContainer>
            </NewComment>

            {pickerShow && (
                <PickerContainer>
                    <Picker onEmojiClick={onEmojiClick} />
                </PickerContainer>
            )}

            {comments?.map((comment) => (
                <Comment
                    update={update}
                    setUpdate={setUpdate}
                    key={comment._id}
                    comment={comment}
                    setComments={setComments}
                />
            ))}
        </Container>
    );
};

export default Comments;
