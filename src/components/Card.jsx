import React, { useEffect, useState } from "react";
import TimeAgo from "react-timeago";
import axios from "axios";
import numeral from "numeral";
import { endpoints } from "../utils/Constants";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const CardDiv = styled.div`
    // padding: 0.7rem;
    margin-bottom: 2rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    background: transparent !important;
    gap: 20px;

    @media only screen and (max-width: 768px) {
        margin-bottom: 1rem;
    }
`;
const VideoImgDiv = styled.div`
    /* background-color: #2e2e2e; */
    position: relative;
`;
const Img = styled.img`
    width: 100%;
    // height: 300px;
    border-radius: 10px;

    @media only screen and (max-width: 568px) {
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
const VideoDetailsDiv = styled.div`
    display: flex;
    gap: 20px;

    @media only screen and (max-width: 768px) {
        gap: 10px;
    }
`;
const ChannelImgDiv = styled.div`
    height: 40px;
    width: 40px;
    background-color: #2e2e2e;
    border-radius: 50%;
    overflow: hidden;
`;

const ChannelImg = styled.img`
    height: 40px;
    width: 40px;
    border-radius: 50%;
    object-fit: cover;
`;
const Details = styled.div`
    display: flex;
    justify-content: space-around;
    /* align-items: center; */
    flex-direction: column;
    gap: 3px;
`;

const ExtraDetails = styled.div`
    @media only screen and (max-width: 768px) {
        display: flex;
        gap: 3px;
    }
`;
const Title = styled.span`
    font-size: 16px;
    line-height: 18px;
    color: #fff;
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

const Card = ({ video }) => {
    const [channel, setChannel] = useState({});

    useEffect(() => {
        const fetchChannel = async () => {
            const res = await axios.get(`${endpoints.USER}/${video.userId}`);
            setChannel(res.data);
        };

        fetchChannel();
    }, [video.userId]);
    // console.log(
    //     channel?.img?.slice(0, 49) +
    //         "ar_1.1,c_crop/" +
    //         channel?.img?.slice(49, channel?.img?.length)
    // );

    return (
        <CardDiv>
            <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
                <VideoImgDiv>
                    <Img
                        src={
                            video.imgUrl ||
                            "https://wallpaperaccess.com/full/1285952.jpg"
                        }
                        alt="video_thumbnail"
                    />
                    <VideoDuration>{"2:34"}</VideoDuration>
                </VideoImgDiv>
            </Link>
            <VideoDetailsDiv>
                <Link to={`/videos/channel/${channel._id}`}>
                    <ChannelImgDiv>
                        <ChannelImg
                            alt=""
                            src={
                                channel.img ||
                                "https://res.cloudinary.com/debanjan/image/upload/v1667971010/user_yz3ysi.png"
                            }
                        />
                    </ChannelImgDiv>
                </Link>
                <Details>
                    <Title>{video.title}</Title>
                    <ExtraDetails>
                        <ChannelName>{channel.name}</ChannelName>
                        <Info>
                            <Dot>• </Dot>
                            {numeral(video.views)
                                .format("0a")
                                .toUpperCase()}{" "}
                            views • <TimeAgo date={video.createdAt} />
                        </Info>
                    </ExtraDetails>
                </Details>
            </VideoDetailsDiv>
        </CardDiv>
    );
};

export default Card;
