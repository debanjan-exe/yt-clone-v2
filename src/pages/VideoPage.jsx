import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { endpoints } from "../utils/Constants";
import { dislike, fetchStart, fetchSuccess, like } from "../redux/videoSlice";
import axios from "axios";
import { subscription } from "../redux/userSlice";
import TimeAgo from "react-timeago";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
// import ShowMoreText from "react-show-more-text";
// import Comments from "../components/Comments";
import Recommendations from "../components/Recommendations";

const Container = styled.div``;

const Wrapper = styled.div`
    padding: 5px;

    @media only screen and (max-width: 768px) {
        padding: 0px;
    }
`;

const VideoWrapper = styled.div`
    padding: 10px;
    @media only screen and (max-width: 768px) {
        padding: 0px;
    }
`;

const VideoFrame = styled.video`
    max-height: 720px;
    width: 100%;
    object-fit: cover;
`;

const Title = styled.h1`
    font-size: 18px;
    font-weight: 600;
    margin-top: 20px;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.text};

    @media only screen and (max-width: 768px) {
        margin-bottom: 5px;
    }
`;

const Details = styled.div`
    margin: 20px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media only screen and (max-width: 768px) {
        margin-top: 20px;
        margin-bottom: 0px;
        flex-direction: column;
    }
`;

const Info = styled.span`
    /* color: #999; */
    font-weight: 500;
    margin-bottom: 10px;
    display: flex;
    justify-content: start;

    @media only screen and (max-width: 768px) {
        display: none;
    }
`;

const InfoMobile = styled.span`
    display: none;

    @media only screen and (max-width: 768px) {
        display: block;
        color: #999;
        display: flex;
        justify-content: start;
        font-size: 12px;
    }
`;

const Buttons = styled.div`
    display: flex;
    gap: 20px;
    color: ${({ theme }) => theme.text};

    @media only screen and (max-width: 768px) {
        margin: 20px;
        width: 100%;
        overflow-x: scroll;
        gap: 10px;

        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

const Button = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    background-color: #2e2e2e70;
    padding: 5px 15px;
    border-radius: 30px;

    &:hover {
        background-color: #2e2e2e;
    }
`;

const Channel = styled.div`
    gap: 40px;
    display: flex;
    justify-content: space-between;
    align-content: center;

    @media only screen and (max-width: 768px) {
        width: 100%;
    }
`;

const ChannelInfo = styled.div`
    display: flex;
    gap: 20px;

    @media only screen and (max-width: 768px) {
        gap: 10px;
    }
`;

const ChannelImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

const ChannelDetail = styled.div`
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
    font-weight: 500;
`;

const ChannelCounter = styled.span`
    color: #999;
    font-size: 12px;
`;

const Description = styled.div`
    font-size: 16px;
    white-space: pre-line;
`;

const Subscribe = styled.button`
    display: flex;
    align-items: center;
    background-color: #cc1a00;
    font-weight: 500;
    font-size: 14px;
    color: #fff;
    border: none;
    border-radius: 30px;
    height: max-content;
    padding: 8px 15px;
    cursor: pointer;
`;

const DescriptionDiv = styled.div`
    background-color: #2e2e2e70;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
`;

const Videopage = () => {
    const { currentUser } = useSelector((state) => state.user);
    const { currentVideo } = useSelector((state) => state.video);
    const path = useLocation().pathname.split("/")[2];
    const [channel, setChannel] = useState({});
    const dispatch = useDispatch();
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(fetchStart());
                const videoRes = await axios.get(`${endpoints.VIDEO}/${path}`);
                const channelRes = await axios.get(
                    `${endpoints.USER}/${videoRes.data.userId}`
                );
                // console.log(videoRes.data);
                setChannel(channelRes.data);
                dispatch(fetchSuccess(videoRes.data));
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [path, dispatch]);

    const handleLike = async () => {
        if (currentUser) {
            await axios.put(`${endpoints.LIKE_VIDEO}/${currentVideo._id}`);
            dispatch(like(currentUser._id));
        }
    };

    const handleDislike = async () => {
        if (currentUser) {
            await axios.put(`${endpoints.DISLIKE_VIDEO}/${currentVideo._id}`);
            dispatch(dislike(currentUser._id));
        }
    };

    const handleSubscribe = async () => {
        if (currentUser) {
            currentUser.subscribedUsers.includes(channel._id)
                ? await axios.put(
                      `${endpoints.UNSUBSCRIBE_CHANNEL}/${channel._id}`
                  )
                : await axios.put(
                      `${endpoints.SUBSCRIBE_CHANNEL}/${channel._id}`
                  );
            dispatch(subscription(channel._id));
            setSubscribed(!subscribed);
        }
    };

    return (
        <Container>
            <Wrapper>
                <Row>
                    <Col lg={8}>
                        <VideoWrapper>
                            <VideoFrame src={currentVideo?.videoUrl} controls />
                            <Title>{currentVideo?.title}</Title>

                            <InfoMobile>
                                {currentVideo?.views} views •{" "}
                                <TimeAgo
                                    date={currentVideo?.createdAt}
                                    style={{ marginLeft: "3px" }}
                                />
                            </InfoMobile>

                            <Details>
                                <Channel>
                                    <ChannelInfo>
                                        <Link
                                            to={`/videos/channel/${channel._id}`}
                                        >
                                            <ChannelImage src={channel.img} />
                                        </Link>
                                        <ChannelDetail>
                                            <ChannelName>
                                                {channel.name}
                                            </ChannelName>
                                            <ChannelCounter>
                                                {channel.subscribers}{" "}
                                                subscribers
                                            </ChannelCounter>
                                        </ChannelDetail>
                                    </ChannelInfo>
                                    <Subscribe
                                        onClick={handleSubscribe}
                                        // currentUser={currentUser}
                                        // channel={channel}
                                    >
                                        {currentUser &&
                                        currentUser.subscribedUsers?.includes(
                                            channel._id
                                        )
                                            ? "Subscribed"
                                            : "Subscribe"}
                                    </Subscribe>
                                </Channel>

                                <Buttons>
                                    <Button onClick={handleLike}>
                                        {currentUser &&
                                        currentVideo?.likes?.includes(
                                            currentUser._id
                                        ) ? (
                                            <ThumbUpIcon />
                                        ) : (
                                            <ThumbUpOutlinedIcon />
                                        )}
                                        {currentVideo?.likes?.length}
                                    </Button>
                                    <Button onClick={handleDislike}>
                                        {currentUser &&
                                        currentVideo?.dislikes?.includes(
                                            currentUser._id
                                        ) ? (
                                            <ThumbDownIcon />
                                        ) : (
                                            <ThumbDownAltOutlinedIcon />
                                        )}
                                        Dislike
                                    </Button>
                                    <Button>
                                        <ReplyOutlinedIcon /> Share
                                    </Button>
                                    <Button>
                                        <PlaylistAddIcon /> Save
                                    </Button>
                                </Buttons>
                            </Details>

                            <DescriptionDiv>
                                <Info>
                                    {currentVideo?.views} views •{" "}
                                    <TimeAgo
                                        date={currentVideo?.createdAt}
                                        style={{ marginLeft: "3px" }}
                                    />
                                </Info>
                                <Description>{currentVideo?.desc}</Description>
                            </DescriptionDiv>

                            {/* <Comments videoId={currentVideo?._id} /> */}
                        </VideoWrapper>
                    </Col>
                    <Col lg={4}>
                        <Recommendations tags={currentVideo?.tags} />
                    </Col>
                </Row>
            </Wrapper>
        </Container>
    );
};

export default Videopage;
