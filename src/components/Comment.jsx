import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TimeAgo from "react-timeago";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useSelector } from "react-redux";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Reply from "./Reply";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import Picker from "emoji-picker-react";
import { endpoints } from "../utils/Constants";

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

const ReplyText = styled.span`
    /* font-size: 14px; */
    margin-left: 3px;
`;

const CommentActions = styled.span`
    display: flex;
    gap: 20px;
    align-items: center;
    font-size: 12px;
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

const CmntLike = styled.span`
    display: flex;
    gap: 5px;
    align-items: center;
    cursor: pointer;
`;

const CmntDislike = styled.span`
    cursor: pointer;
`;

const RepliesDiv = styled.div`
    display: flex;
    flex-direction: column;
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

const NewComment = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10px;
`;

// const Avatar = styled.img`
//     width: 40px;
//     height: 40px;
//     border-radius: 50%;
// `;

const InputContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
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
const PickerContainer = styled.div``;

const Comment = ({ comment, update, setUpdate }) => {
    const [channel, setChannel] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [pickerShow, setPickerShow] = useState(false);
    const [currentReply, setCurrentReply] = useState("");
    const replyInput = useRef(null);

    useEffect(() => {
        const fetchComment = async () => {
            const res = await axios.get(`${endpoints.USER}/${comment.userId}`);
            setChannel(res.data);
        };
        fetchComment();
    }, [comment?.userId]);

    useEffect(() => {
        if (replyInput.current) {
            replyInput.current.focus();
        }
    }, [showReplyInput]);

    const handleCommentLike = async () => {
        if (currentUser) {
            await axios.put(`/api/comments/like/${comment?._id}`);
        }
    };

    const handleCommentDislike = async () => {
        if (currentUser) {
            await axios.put(`/api/comments/dislike/${comment?._id}`);
        }
    };

    const handleDeleteCmnt = async () => {
        if (currentUser) {
            await axios.delete(`/api/comments/delete/${comment?._id}`);
        }
    };

    const onEmojiClick = (e) => {
        setCurrentReply((prevText) => prevText + e.emoji);
    };

    const handlePostReply = async () => {
        if (currentReply) {
            if (currentUser) {
                await axios.put(`/api/comments/reply/${comment?._id}`, {
                    replyDesc: currentReply,
                });
                setCurrentReply("");
                setShowReplyInput(false);
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
                    <ReplyBtn
                        onClick={() => {
                            handleDeleteCmnt();
                            setUpdate(!update);
                        }}
                    >
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
                                <EmojiBtn
                                    onClick={() => {
                                        setPickerShow(!pickerShow);
                                    }}
                                >
                                    <TagFacesIcon />
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

                {pickerShow && (
                    <PickerContainer>
                        <Picker onEmojiClick={onEmojiClick} />
                    </PickerContainer>
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
                            />
                        ))}
                    </RepliesDiv>
                )}
            </Details>
        </Container>
    );
};

export default Comment;
