import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import { endpoints } from "../utils/Constants";
import { useSelector } from "react-redux";

const Container = styled.div``;

const Wrapper = styled.div``;

const ChannelDetails = styled.div`
    display: flex;
    gap: 40px;
    align-items: center;
`;

const ChannelInfo = styled.div``;

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

const ChannelPage = () => {
    const userId = useLocation().pathname.split("/")[3];
    const [videos, setVideos] = useState([]);
    const [channel, setChannel] = useState({});
    const [likedVideos, setLikedVideos] = useState([]);

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

        const fetchLikedVideos = async () => {
            const res = await axios.get(`${endpoints.USER_LIKED_VIDEOS}`);
            setLikedVideos(res.data);
        };
        fetchLikedVideos();
        fetchChannel();
        fetchVideos();
    }, [userId]);

    return (
        <Container>
            <Wrapper>
                <Hr />
                <ChannelDetails>
                    <ChannelImgDiv>
                        <ChannelImg src={channel.img} />
                    </ChannelImgDiv>
                    <ChannelInfo>
                        <Title>{channel.name}</Title>
                        <ChannelCounter>
                            {channel.subscribers} subscribers
                        </ChannelCounter>
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
                {userId === currentUser._id && (
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
