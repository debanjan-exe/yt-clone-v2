import axios from "axios";
import React, { useEffect, useState } from "react";
import Timeago from "react-timeago";
import styled from "styled-components";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSelector } from "react-redux";
import { endpoints } from "../utils/Constants";

const Container = styled.div`
    display: flex;
    gap: 10px;
    margin: 10px 0px;
`;

const Avatar = styled.img`
    width: 25px;
    height: 25px;
    border-radius: 50%;
`;

const DelRep = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 3px;
    border-radius: 50%;

    &:hover {
        background-color: ${({ theme }) => theme.soft};
    }
`;

const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
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
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
`;

const Reply = ({
    comments,
    setComments,
    comment,
    reply,
    update,
    setUpdate,
}) => {
    const [userData, setUserData] = useState({});
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`${endpoints.USER}/${reply.userId}`);
            setUserData(res.data);
        };
        fetchUser();
    }, [reply.userId]);

    const handleReplyDelete = async () => {
        if (currentUser) {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: currentUser.access_token,
                },
            };
            await axios.put(
                `${endpoints.GET_COMMENTS}/reply/${comment._id}/delete/${reply._id}`,
                {},
                config
            );
            setUpdate(!update);
        }
    };

    return (
        <Container>
            <Avatar src={userData.img} />
            <Details>
                <Name>
                    {userData.name}{" "}
                    <Date>
                        {" "}
                        <Timeago date={reply.createdAt} />{" "}
                    </Date>
                </Name>
                <Text>
                    {reply.desc}{" "}
                    {currentUser && currentUser._id === reply.userId && (
                        <DelRep onClick={handleReplyDelete}>
                            <DeleteOutlineIcon fontSize="10px" />
                        </DelRep>
                    )}
                </Text>
            </Details>
        </Container>
    );
};

export default Reply;
