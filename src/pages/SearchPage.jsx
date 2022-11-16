import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import SearchCard from "../components/SearchCard";
import { endpoints } from "../utils/Constants";

const Container = styled.div`
    padding: 0px 40px;

    @media only screen and (max-width: 768px) {
        padding: 0;
    }
`;

const Wrapper = styled.div``;

const Hr = styled.hr`
    margin: 15px 0px;
    border: 0.5px solid ${({ theme }) => theme.soft};
`;

const SearchPage = () => {
    const [videos, setVideos] = useState([]);
    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`${endpoints.GET_VIDEOS}/trend`);
            setVideos(res.data);
        };

        fetchVideos();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            <Wrapper>
                <Hr />
                {videos.map((video) =>
                    window.innerWidth < 768 ? (
                        <Card key={video._id} video={video} />
                    ) : (
                        <SearchCard key={video._id} video={video} />
                    )
                )}
            </Wrapper>
        </Container>
    );
};

export default SearchPage;
