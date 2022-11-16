import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { endpoints } from "../utils/Constants";
import RecCards from "./RecCards/RecCards";

const Container = styled.div``;
const Wrapper = styled.div`
    padding: 10px;

    @media only screen and (max-width: 768px) {
        padding: 0;
    }
`;

const Recommendations = ({ tags }) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`${endpoints.GET_VIDEOS}/random`);
            setVideos(res.data);
        };
        fetchVideos();
    }, [tags]);

    return (
        <Container>
            <Wrapper>
                {videos.map((video) => (
                    <RecCards key={video._id} video={video} />
                ))}
                {videos.map((video) => (
                    <RecCards key={video._id} video={video} />
                ))}
                {videos.map((video) => (
                    <RecCards key={video._id} video={video} />
                ))}
            </Wrapper>
        </Container>
    );
};

export default Recommendations;
