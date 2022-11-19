import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { endpoints } from "../utils/Constants";
import TimeAgo from "react-timeago";
import { useSelector } from "react-redux";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import Picker from "emoji-picker-react";
import CloseIcon from "@mui/icons-material/Close";
import Reply from "./Reply";

const Container = styled.div`
    display: flex;
    gap: 10px;
    margin: 30px 0px;
    /* width: 100%; */
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

const Details = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: ${({ theme }) => theme.text};
`;

const Name = styled.span`
    font-size: 13px;
    font-weight: 500;
`;

const Date = styled.span`
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.textSoft};
    margin-left: 5px;
`;
const Text = styled.span`
    font-size: 14px;
`;

const CommentActions = styled.span`
    display: flex;
    gap: 20px;
    align-items: center;
    font-size: 12px;
`;

const CmntLike = styled.span`
    display: flex;
    gap: 5px;
    align-items: center;
    cursor: pointer;
`;

const CmntDislike = styled.span`
    cursor: pointer;
`;

const ReplyBtn = styled.span`
    font-size: 12px;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 30px;
    transition: all 0.1s ease-in-out;
    font-weight: 600;
    user-select: none;
    &:hover {
        background-color: ${({ theme }) => theme.soft};
    }
`;

const NewComment = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10px;
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

const EmojiBtn = styled.div`
    cursor: pointer;
    color: ${({ theme }) => theme.text};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 5px;
    transition: all 0.1s ease-in-out;
    position: relative;

    &:hover {
        background-color: ${({ theme }) => theme.soft};
        /* color: ${({ theme }) => theme.text}; */
    }
`;

const PickerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: absolute;
    /* bottom: 0; */
    top: 15px;
    left: 0;

    @media only screen and (max-width: 500px) {
        top: 40px;
        left: -92px;
        align-items: flex-start;
    }
`;

const RepliesBtn = styled.button`
    width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3ea6ff;
    border: none;
    background-color: transparent;
    border-radius: 30px;
    padding: 5px 50px;
    font-weight: 600;
    cursor: pointer;
    margin-top: -5px;

    &:hover {
        background-color: #3ea6ff33;
    }
`;

const ReplyText = styled.span`
    /* font-size: 14px; */
    margin-left: 3px;
`;

const RepliesDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

const Comment = ({ comments, comment, update, setUpdate, setComments }) => {
    const [channel, setChannel] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [currentReply, setCurrentReply] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [pickerShow, setPickerShow] = useState(false);
    const replyInput = useRef(null);

    useEffect(() => {
        const fetchChannel = async () => {
            const res = await axios.get(`${endpoints.USER}/${comment.userId}`);
            setChannel(res.data);
        };

        fetchChannel();
    }, [comment?.userId]);

    useEffect(() => {
        if (replyInput.current) {
            replyInput.current.focus();
        }
    }, [showReplyInput]);

    const handleCommentLike = async () => {
        if (currentUser) {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: currentUser.access_token,
                },
            };
            await axios.put(
                `${endpoints.GET_COMMENTS}/like/${comment?._id}`,
                {},
                config
            );
            setUpdate(!update);
        }
    };

    const handleCommentDislike = async () => {
        if (currentUser) {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: currentUser.access_token,
                },
            };
            await axios.put(
                `${endpoints.GET_COMMENTS}/dislike/${comment?._id}`,
                {},
                config
            );
            setUpdate(!update);
        }
    };

    const handleDeleteCmnt = async () => {
        if (currentUser) {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: currentUser.access_token,
                },
            };
            await axios.delete(
                `${endpoints.GET_COMMENTS}/delete/${comment?._id}`,
                config
            );
            setUpdate(!update);
        }
    };

    const onEmojiClick = (e) => {
        setCurrentReply((prevText) => prevText + e.emoji);
    };

    const handlePostReply = async () => {
        if (currentReply) {
            if (currentUser) {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: currentUser.access_token,
                    },
                };
                await axios.put(
                    `${endpoints.GET_COMMENTS}/reply/${comment?._id}`,
                    {
                        replyDesc: currentReply,
                    },
                    config
                );
                setCurrentReply("");
                setShowReplyInput(false);
                setPickerShow(false);
                setUpdate(!update);
            }
        }
    };

    return (
        <Container>
            <Avatar src={channel?.img} />
            <Details>
                <Name>
                    {channel?.name}{" "}
                    <Date>
                        {" "}
                        <TimeAgo date={comment?.createdAt} />{" "}
                    </Date>
                </Name>
                <Text>{comment?.desc}</Text>
                <CommentActions>
                    <CmntLike onClick={handleCommentLike}>
                        {currentUser &&
                        comment?.likes?.includes(currentUser._id) ? (
                            <ThumbUpIcon fontSize="small" />
                        ) : (
                            <ThumbUpOutlinedIcon fontSize="small" />
                        )}
                        {comment?.likes?.length}
                    </CmntLike>
                    <CmntDislike onClick={handleCommentDislike}>
                        {currentUser &&
                        comment?.dislikes?.includes(currentUser?._id) ? (
                            <ThumbDownIcon fontSize="small" />
                        ) : (
                            <ThumbDownAltOutlinedIcon fontSize="small" />
                        )}
                    </CmntDislike>
                    <ReplyBtn
                        onClick={() => {
                            if (currentUser) {
                                setShowReplyInput(!showReplyInput);
                            }
                        }}
                    >
                        Reply
                    </ReplyBtn>
                    <ReplyBtn onClick={handleDeleteCmnt}>
                        {currentUser && currentUser?._id === comment.userId && (
                            <DeleteOutlineIcon fontSize="small" />
                        )}
                    </ReplyBtn>
                </CommentActions>
                {showReplyInput && (
                    <NewComment>
                        <Avatar
                            src={
                                currentUser
                                    ? currentUser?.img
                                    : "https://res.cloudinary.com/debanjan/image/upload/v1667971010/user_yz3ysi.png"
                            }
                        />
                        <InputContainer>
                            <Input
                                ref={replyInput}
                                placeholder="Add a reply..."
                                value={currentReply}
                                onChange={(e) => {
                                    setCurrentReply(e.target.value);
                                    setPickerShow(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handlePostReply();
                                    }
                                }}
                            />
                            <ButtonContainer>
                                <EmojiBtn>
                                    <TagFacesIcon
                                        onClick={() => {
                                            setPickerShow(!pickerShow);
                                        }}
                                    />
                                    {pickerShow && (
                                        <PickerContainer>
                                            <CloseIcon
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    setPickerShow(false)
                                                }
                                            />
                                            <Picker
                                                onEmojiClick={onEmojiClick}
                                            />
                                        </PickerContainer>
                                    )}
                                </EmojiBtn>
                                <Btns>
                                    <CText
                                        onClick={() => {
                                            setShowReplyInput(false);
                                            setCurrentReply("");
                                        }}
                                    >
                                        cancel
                                    </CText>
                                    <Button onClick={handlePostReply}>
                                        Reply
                                    </Button>
                                </Btns>
                            </ButtonContainer>
                        </InputContainer>
                    </NewComment>
                )}
                {comment?.replies.length === 0 ? (
                    ""
                ) : (
                    <RepliesBtn onClick={() => setShowReplies(!showReplies)}>
                        {showReplies ? (
                            <ArrowDropUpIcon />
                        ) : (
                            <ArrowDropDownIcon />
                        )}
                        {comment?.replies.length}
                        <ReplyText>Replies</ReplyText>
                    </RepliesBtn>
                )}

                {showReplies && (
                    <RepliesDiv>
                        {comment?.replies.map((reply) => (
                            <Reply
                                update={update}
                                setUpdate={setUpdate}
                                comment={comment}
                                key={reply._id}
                                reply={reply}
                                comments={comments}
                                setComments={setComments}
                            />
                        ))}
                    </RepliesDiv>
                )}
            </Details>
        </Container>
    );
};

export default Comment;
