import React, { useEffect, useState } from "react";
import CategoriesBar from "../components/categoriesBar/CategoriesBar";
import Card from "../components/Card";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { endpoints } from "../utils/Constants.js";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomepageDiv = styled.div``;

const CardWrapper = styled.div`
    padding: 18px;
    @media only screen and (max-width: 768px) {
        padding: 0px;
    }
`;

const HomePage = ({ type }) => {
    const [videos, setVideos] = useState([]);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (type === "sub") {
            if (!currentUser) {
                navigate("/signin");
            }

            const fetchVideos = async () => {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: currentUser.access_token,
                    },
                };
                const res = await axios.get(
                    `${endpoints.GET_VIDEOS}/${type}`,
                    config
                );
                setVideos(res.data);
            };
            fetchVideos();
        } else {
            const fetchVideos = async () => {
                const res = await axios.get(`${endpoints.GET_VIDEOS}/${type}`);
                setVideos(res.data);
            };
            fetchVideos();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    return (
        <HomepageDiv>
            <CategoriesBar />
            <CardWrapper>
                <Row>
                    {videos.map((video) => (
                        <Col key={video._id} lg={3} md={4}>
                            <Card video={video} />
                        </Col>
                    ))}
                </Row>
            </CardWrapper>
        </HomepageDiv>
    );
};

export default HomePage;
