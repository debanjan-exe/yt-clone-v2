import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import { endpoints } from "../utils/Constants";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { subscription } from "../redux/userSlice";
import { useToast } from "@chakra-ui/react";

const Container = styled.div``;

const Wrapper = styled.div``;

const ChannelDetails = styled.div`
    display: flex;
    gap: 40px;
    align-items: center;
`;

const ChannelInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const Hr = styled.hr`
    margin: 15px 0px;
    border: 0.5px solid ${({ theme }) => theme.soft};
`;

const ChannelImgDiv = styled.div`
    height: 200px;
    width: 200px;
    background-color: #2e2e2e;
    border-radius: 50%;
    overflow: hidden;

    @media only screen and (max-width: 768px) {
        height: 100px;
        width: 100px;
    }
`;

const ChannelImg = styled.img`
    height: 200px;
    width: 200px;
    border-radius: 50%;
    object-fit: cover;

    @media only screen and (max-width: 768px) {
        height: 100px;
        width: 100px;
    }
`;

const ChannelName = styled.span`
    font-size: 20px;
    /* line-height: 18px; */
    color: #fff;
    font-weight: 500;
    padding-bottom: 20px;

    @media only screen and (max-width: 768px) {
        padding-bottom: 0px;
    }
`;

const Title = styled.h1`
    font-size: 20px;
    /* line-height: 18px; */
    color: #fff;
    font-weight: 500;
    padding-bottom: 20px;
`;

const ChannelCounter = styled.span`
    color: #999;
    font-size: 20px;
`;

const Button = styled.div`
    cursor: pointer;
    background-color: red;
    padding: 10px 20px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    margin-top: 10px;
    justify-content: center;
    font-weight: 500;

    &:hover {
        background-color: #de0000;
    }

    @media only screen and (max-width: 768px) {
        margin-top: 5px;
        padding: 5px 10px;
    }
`;

const ChannelPage = () => {
    const userId = useLocation().pathname.split("/")[3];
    const [videos, setVideos] = useState([]);
    const [channel, setChannel] = useState({});
    const [likedVideos, setLikedVideos] = useState([]);
    const dispatch = useDispatch();
    const [subscribed, setSubscribed] = useState(false);
    const [subscribeBtnClick, setSubscribeBtnClick] = useState(false);
    const toast = useToast();

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(
                `${endpoints.GET_VIDEOS_OF_USER}/${userId}`
            );
            setVideos(res.data);
        };

        const fetchChannel = async () => {
            const res = await axios.get(`${endpoints.USER}/${userId}`);
            setChannel(res.data);
        };

        if (currentUser) {
            const fetchLikedVideos = async () => {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: currentUser.access_token,
                    },
                };
                const res = await axios.get(
                    `${endpoints.USER_LIKED_VIDEOS}`,
                    config
                );
                setLikedVideos(res.data);
            };
            fetchLikedVideos();
        }
        fetchChannel();
        fetchVideos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, subscribeBtnClick]);

    const handleSubscribe = async () => {
        if (currentUser) {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: currentUser.access_token,
                },
            };
            currentUser.subscribedUsers.includes(channel._id)
                ? await axios.put(
                      `${endpoints.UNSUBSCRIBE_CHANNEL}/${channel._id}`,
                      {},
                      config
                  )
                : await axios.put(
                      `${endpoints.SUBSCRIBE_CHANNEL}/${channel._id}`,
                      {},
                      config
                  );

            dispatch(subscription(channel._id));
            setSubscribed(!subscribed);
            setSubscribeBtnClick(!subscribeBtnClick);
            currentUser.subscribedUsers.includes(channel._id)
                ? toast({
                      title: `Unsubscribed to ${channel.name}`,
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                      position: "bottom-left",
                  })
                : toast({
                      title: `Subscribed to ${channel.name}`,
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                      position: "bottom-left",
                  });
        }
    };

    return (
        <Container>
            <Wrapper>
                <Hr />
                <ChannelDetails>
                    <ChannelImgDiv>
                        <ChannelImg src={channel.img} />
                    </ChannelImgDiv>
                    <ChannelInfo>
                        <ChannelName>{channel.name}</ChannelName>
                        <ChannelCounter>
                            {channel.subscribers} subscribers
                        </ChannelCounter>
                        <Button onClick={handleSubscribe}>
                            {currentUser &&
                            currentUser.subscribedUsers?.includes(channel._id)
                                ? "Subscribed"
                                : "Subscribe"}
                        </Button>
                    </ChannelInfo>
                </ChannelDetails>
                <Hr />
                <Title>Videos Uploaded by {channel.name}</Title>

                <Row>
                    {videos.map((video) => (
                        <Col key={video._id} lg={3} md={4}>
                            <Card video={video} />
                        </Col>
                    ))}
                </Row>
                <Hr />
                {currentUser && userId === currentUser._id && (
                    <>
                        <Title>Videos Liked by You</Title>
                        {likedVideos && (
                            <Row>
                                {likedVideos.map((video) => (
                                    <Col key={video._id} lg={3} md={4}>
                                        <Card video={video} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </>
                )}
            </Wrapper>
        </Container>
    );
};

export default ChannelPage;
