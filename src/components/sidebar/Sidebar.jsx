import React, { useEffect, useRef } from "react";
import "./Sidebar.scss";
import HomeIcon from "@mui/icons-material/Home";
import { TbUserCircle } from "react-icons/tb";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

const SidebarDiv = styled.div`
    background-color: #0f0f0f;
    display: flex;
    flex-direction: column;
    width: 269px;
    overflow-y: scroll;
    padding: 10px 15px;
    transition: all 0.1s ease-in-out;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const DimContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 94vh;
    z-index: 1;
    background-color: #000000a7;
`;

const Hr = styled.hr`
    margin: 15px 0px;
    border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Li = styled.li`
    display: flex;
    align-items: center;
    padding: 0.5rem 1.1rem;
    // margin: 0.2rem 0rem;
    cursor: pointer;
    gap: 20px;
    border-radius: 10px;

    &:hover {
        background-color: #2e2e2e;
    }
`;

const LiSpan = styled.span`
    // margin-left: 1rem;
    font-size: 14px;
    // font-weight: 500;
    letter-spacing: 0.4px;
`;

const LiText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0rem 1rem;
    margin-bottom: 0.3rem;
`;

const LoginText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0rem 1rem;
`;

const LoginTextMain = styled.span`
    font-size: 14px;
`;

const SignInBtn = styled.button`
    width: max-content;
    padding: 5px 15px;
    background-color: transparent;
    border: 1px solid #3ea6ff;
    color: #3ea6ff;
    border-radius: 30px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    outline: none;
    // color: #b2b2b2c8;

    &:hover {
        border: 1px solid #93cdff2f;
        background-color: #93cdff2f;
    }
`;

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
    const clickRef = useRef(null);
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation().pathname.split("/")[1] || "/";

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickOutside = (e) => {
        // if (openSidebar) {
        if (!clickRef.current.contains(e.target)) {
            setOpenSidebar(false);
            // console.log("clicked");
        }
        // }
    };

    const DimScreen = () => {
        return <DimContainer />;
    };

    return (
        <>
            <SidebarDiv
                style={{
                    display:
                        location === "video" && window.innerWidth > 1365
                            ? "none"
                            : "block",
                }}
                className={openSidebar ? "sidebar open " : "sidebar"}
                ref={clickRef}
            >
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    <Li
                        className={location === "/" ? "active" : ""}
                        onClick={() => setOpenSidebar(false)}
                    >
                        <HomeIcon />
                        <LiSpan>Home</LiSpan>
                    </Li>
                </Link>

                <Link
                    to="/trend"
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    <Li
                        className={location === "trend" ? "active" : ""}
                        onClick={() => setOpenSidebar(false)}
                    >
                        <ExploreOutlinedIcon />
                        <LiSpan>Explore</LiSpan>
                    </Li>
                </Link>

                <Link
                    to="/subscriptions"
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    <Li
                        className={location === "subscriptions" ? "active" : ""}
                        onClick={() => setOpenSidebar(false)}
                    >
                        <SubscriptionsOutlinedIcon />
                        <LiSpan>Subscriptions</LiSpan>
                    </Li>
                </Link>
                <Hr />
                <Li>
                    <VideoLibraryOutlinedIcon />
                    <LiSpan>Library</LiSpan>
                </Li>
                <Li>
                    <HistoryOutlinedIcon />
                    <LiSpan>History</LiSpan>
                </Li>
                <Hr />
                {!currentUser && (
                    <>
                        <LoginText>
                            <LoginTextMain>
                                Sign in to like the videos, comment and
                                subscribe.
                            </LoginTextMain>
                            <Link
                                to="/signin"
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <SignInBtn
                                    className="sign_in_btn"
                                    onClick={() => setOpenSidebar(false)}
                                >
                                    <TbUserCircle size={24} />
                                    <LiSpan>Sign in</LiSpan>
                                </SignInBtn>
                            </Link>
                        </LoginText>
                        <Hr />
                    </>
                )}
                <LiText>
                    <LiSpan className="li_text_main">More From Youtube</LiSpan>
                </LiText>
                <Li>
                    <LibraryMusicOutlinedIcon />
                    <LiSpan>Music</LiSpan>
                </Li>
                <Li>
                    <SportsBasketballOutlinedIcon />
                    <LiSpan>Sports</LiSpan>
                </Li>
                <Li>
                    <SportsEsportsOutlinedIcon />
                    <LiSpan>Gaming</LiSpan>
                </Li>
                <Li>
                    <MovieOutlinedIcon />
                    <LiSpan>Movies</LiSpan>
                </Li>
                <Li>
                    <ArticleOutlinedIcon />
                    <LiSpan>News</LiSpan>
                </Li>
                <Li>
                    <LiveTvOutlinedIcon />
                    <LiSpan>Live</LiSpan>
                </Li>

                <Hr />

                <Li>
                    <SettingsOutlinedIcon />
                    <span>Settings</span>
                </Li>
                <Li>
                    <FlagOutlinedIcon />
                    <span>Report</span>
                </Li>
                <Li>
                    <HelpOutlineOutlinedIcon />
                    <span>Help</span>
                </Li>
                <Li>
                    <FeedbackOutlinedIcon />
                    <span>Feedback</span>
                </Li>
            </SidebarDiv>
            {openSidebar && <DimScreen />}
        </>
    );
};

export default Sidebar;
