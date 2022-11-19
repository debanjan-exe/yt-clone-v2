import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { endpoints } from "../utils/Constants";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import TimeAgo from "react-timeago";
import axios from "axios";
import numeral from "numeral";

const Container = styled.div`
    margin: 20px 0px;
`;

const Wrapper = styled.div``;

const Img = styled.img`
    width: 100%;
    border-radius: 8px;
`;

const VideoDetailsDiv = styled.div`
    padding: 10px;
`;

const Title = styled.h1`
    font-size: 20px;
    line-height: 18px;
    color: #fff;
    font-weight: 500;
    line-height: 20px;
`;

const VideoImgDiv = styled.div`
    position: relative;
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

const Info = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 13px;
    font-weight: 300;
    color: #aaa;
    margin-top: 3px;
`;

const ChannelImgNameDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0px;
`;

const ChannelImg = styled.img`
    height: 30px;
    width: 30px;
    border-radius: 50%;
    object-fit: cover;
`;

const ChannelName = styled.span`
    font-size: 14px;
    color: #aaa;
`;

const Description = styled.div`
    color: #999;
    font-size: 16px;
    /* white-space: pre-line; */
`;

const SearchCard = ({ video }) => {
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
                        <Col md={4} className="thumbnail ">
                            <VideoImgDiv>
                                <Img src={video.imgUrl} />
                                <VideoDuration>{"2:34"}</VideoDuration>
                            </VideoImgDiv>
                        </Col>
                        <Col md={8} className="details">
                            <VideoDetailsDiv>
                                <Title>{video.title}</Title>
                                <Info>
                                    {numeral(video.views)
                                        .format("0a")
                                        .toUpperCase()}{" "}
                                    views • <TimeAgo date={video.createdAt} />
                                </Info>

                                <ChannelImgNameDiv>
                                    <ChannelImg
                                        alt=""
                                        src={
                                            channel.img ||
                                            "https://res.cloudinary.com/debanjan/image/upload/v1667971010/user_yz3ysi.png"
                                        }
                                    />
                                    <ChannelName>{channel.name}</ChannelName>
                                </ChannelImgNameDiv>

                                <Description>
                                    {video.desc.slice(0, 60) + " ..."}
                                </Description>
                            </VideoDetailsDiv>
                        </Col>
                    </Row>
                </Wrapper>
            </Container>
        </Link>
    );
};

export default SearchCard;
