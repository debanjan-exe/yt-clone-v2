import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";
import TimeAgo from "react-timeago";
import axios from "axios";
import numeral from "numeral";
import { endpoints } from "../../utils/Constants";
import "./RecCards.scss";
import { Link } from "react-router-dom";

const Container = styled.div``;
const Wrapper = styled.div`
    margin-bottom: 20px;
`;

const VideoDetailsDiv = styled.div`
    display: flex;
    gap: 10px;

    @media only screen and (max-width: 768px) {
        margin-top: 10px;
    }
`;

const ChannelImgDiv = styled.div`
    display: none;
    @media only screen and (max-width: 768px) {
        display: block;
    }
`;

const Details = styled.div``;

const Img = styled.img`
    width: 100%;
    border-radius: 8px;
    /* position: relative; */
    @media only screen and (max-width: 768px) {
        border-radius: 5px;
    }
`;

const VideoDuration = styled.span`
    font-size: 12px;
    padding: 0px 5px;
    border-radius: 5px;
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.837);
    color: #fff;
`;

const ChannelImg = styled.img`
    height: 40px;
    width: 40px;
    border-radius: 50%;
    object-fit: cover;
`;

const Title = styled.h1`
    font-size: 16px;
    line-height: 18px;
    color: #fff;
    font-weight: 500;
    line-height: 20px;
`;

const ExtraDetails = styled.div`
    @media only screen and (max-width: 768px) {
        display: flex;
        gap: 3px;
    }
`;

const ChannelName = styled.span`
    font-size: 14px;
    color: #aaa;
`;
const Info = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 13px;
    font-weight: 300;
    color: #aaa;
`;

const Dot = styled.span`
    display: none;
    @media only screen and (max-width: 768px) {
        display: flex;
    }
`;

const VideoImgDiv = styled.div`
    position: relative;
`;

const RecCards = ({ video }) => {
    const [channel, setChannel] = useState({});

    useEffect(() => {
        const fetchChannel = async () => {
            const res = await axios.get(`${endpoints.USER}/${video.userId}`);
            setChannel(res.data);
        };

        fetchChannel();
    }, [video.userId]);

    return (
        <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
            <Container>
                <Wrapper>
                    <Row>
                        <Col sm={6} md={5} className="thumbnail ">
                            <VideoImgDiv>
                                <Img src={video.imgUrl} />
                                <VideoDuration>{"2:34"}</VideoDuration>
                            </VideoImgDiv>
                        </Col>
                        <Col sm={6} md={7} className="details">
                            <VideoDetailsDiv>
                                <ChannelImgDiv>
                                    <ChannelImg src={channel.img} />
                                </ChannelImgDiv>
                                <Details>
                                    <Title>{video.title}</Title>
                                    <ExtraDetails>
                                        <ChannelName>
                                            {channel.name}
                                        </ChannelName>
                                        <Info>
                                            <Dot>• </Dot>
                                            {numeral(video.views)
                                                .format("0a")
                                                .toUpperCase()}
                                            views •{" "}
                                            <TimeAgo date={video.createdAt} />
                                        </Info>
                                    </ExtraDetails>
                                </Details>
                            </VideoDetailsDiv>
                        </Col>
                    </Row>
                </Wrapper>
            </Container>
        </Link>
    );
};

export default RecCards;
