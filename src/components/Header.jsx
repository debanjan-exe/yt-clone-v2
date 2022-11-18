import React, { useEffect, useRef, useState } from "react";
import { TbUserCircle } from "react-icons/tb";
import logo from "../assets/img/logo.png";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import ListeningModal from "./ListeningModal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Upload from "./Upload";
import { endpoints } from "../utils/Constants";
import axios from "axios";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const HeaderContainer = styled.div`
    position: sticky;
    height: 6vh;
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 100vw;
    padding: 1.5rem 2rem;
    z-index: 999;

    @media only screen and (max-width: 768px) {
        padding: 1rem 1rem;
    }
`;

const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const LeftContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;

    @media only screen and (max-width: 768px) {
        gap: 10px;
    }
`;

const CenterContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    /* position: relative; */

    @media only screen and (max-width: 500px) {
        display: none;
    }
`;

const RightContainer = styled.div``;

const UserDetails = styled.div`
    user-select: none;
    display: flex;
    align-items: center;
    gap: 10px;
`;
const UserActions = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const UploadBtn = styled.div`
    padding: 5px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s ease-in-out;

    &:hover {
        background: #222222;
    }
`;

const UserProfile = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px;
    border-radius: 10px;
    &:hover {
        background: #222222;
    }
`;

const UserImg = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #999;
    object-fit: cover;
`;

const SearchContainer = styled.div`
    display: flex;
    background: transparent;
    border: 1px solid rgb(86, 86, 86);
    padding: 3px 20px;
    border-radius: 30px;
    gap: 10px;
    width: clamp(400px, 40vw, 600px);
    height: clamp(35px, 5vw, 37px);
`;

const MicInput = styled.div`
    padding: 5px;
    border-radius: 50%;
    background: #2e2e2e70;
    cursor: pointer;

    &:hover {
        background-color: #2e2e2e;
    }
`;
const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
`;
const LogoText = styled.span`
    color: #fff;
    letter-spacing: -1px;
    font-size: 23px;
    font-family: "Oswald", sans-serif;
    // line-height: 5;
    padding-bottom: 2px;
`;

const LogoImg = styled.img`
    height: 30px;
`;

const SearchInput = styled.input`
    color: #fff;
    outline: none;
    background: transparent;
    border: none;
    width: 100%;
`;

const SearchIcon = styled.div`
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const MenuBar = styled.div`
    font-size: 25px !important;
    display: flex;
    border-radius: 5px;
    cursor: pointer;
`;

const UserName = styled.span`
    @media only screen and (max-width: 768px) {
        display: none;
    }
`;

const SignInBtn = styled.div`
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

    &:hover {
        border: 1px solid #93cdff2f;
        background-color: #93cdff2f;
    }

    @media only screen and (max-width: 768px) {
        padding: 2px 10px;
        font-size: 12px;
    }
`;

const SignInIcon = styled.div`
    display: flex;
    align-items: center;
    font-size: 24px;
`;

const SignInBtnText = styled.span`
    font-size: "14px";
`;

const Logout = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #2e2e2e;
    position: absolute;
    bottom: -90px;
    right: 0;
    border-radius: 5px;
    -webkit-box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.09);
    -moz-box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.09);
    box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.09);
`;

const Menu = styled.span`
    cursor: pointer;
    display: flex;
    gap: 10px;
    padding: 10px 20px;
    border-radius: 5px;

    &:first-of-type {
        &:hover {
            background-color: #1da1f2;
        }
    }

    &:hover {
        background-color: #ff0000;
    }
`;

const Header = ({ openSidebar, setOpenSidebar }) => {
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [click, setClick] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const refLogout = useRef(null);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    const handleClickOutside = (e) => {
        if (refLogout.current) {
            if (!refLogout.current.contains(e.target)) {
                setClick(false);
            }
        }
    };

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${endpoints.LOGOUT}`);
            if (res.status === 200) {
                dispatch(logout());
            }
            // navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <HeaderContainer>
                <HeaderWrapper>
                    <LeftContainer>
                        {window.innerWidth < 1366 ? (
                            <>
                                {openSidebar ? (
                                    <MenuBar
                                        onClick={() => setOpenSidebar(false)}
                                    >
                                        <CloseIcon />
                                    </MenuBar>
                                ) : (
                                    <MenuBar
                                        onClick={() => setOpenSidebar(true)}
                                    >
                                        <MenuRoundedIcon />
                                    </MenuBar>
                                )}
                            </>
                        ) : (
                            <>
                                <MenuRoundedIcon className="menu_bar" />
                            </>
                        )}

                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Logo>
                                <LogoImg src={logo} alt="" />
                                <LogoText>YouTube</LogoText>
                            </Logo>
                        </Link>
                    </LeftContainer>
                    <CenterContainer>
                        <SearchContainer>
                            <SearchInput
                                type="text"
                                className="search_input"
                                placeholder="Search"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <SearchIcon
                                onClick={() => {
                                    navigate(`/search?q=${input}`);
                                }}
                            >
                                <IoSearchOutline />
                            </SearchIcon>
                        </SearchContainer>
                        <MicInput>
                            <MicRoundedIcon onClick={() => setOpen(true)} />
                        </MicInput>
                    </CenterContainer>
                    <RightContainer>
                        <UserDetails>
                            {currentUser ? (
                                <UserActions>
                                    <UploadBtn
                                        onClick={() => setOpenUploadModal(true)}
                                    >
                                        {openUploadModal ? (
                                            <VideoCallIcon />
                                        ) : (
                                            <VideoCallOutlinedIcon />
                                        )}
                                    </UploadBtn>
                                    <UserProfile
                                        onClick={() => setClick(!click)}
                                        ref={refLogout}
                                    >
                                        {click && (
                                            <Logout>
                                                <Menu
                                                    onClick={() =>
                                                        navigate(
                                                            `/videos/channel/${currentUser._id}`
                                                        )
                                                    }
                                                >
                                                    <PersonOutlineOutlinedIcon />
                                                    profile
                                                </Menu>
                                                <Menu onClick={logoutHandler}>
                                                    <LogoutRoundedIcon />
                                                    Logout
                                                </Menu>
                                            </Logout>
                                        )}
                                        <UserImg
                                            src={
                                                currentUser.img ||
                                                "https://res.cloudinary.com/debanjan/image/upload/v1667971010/user_yz3ysi.png"
                                            }
                                            alt=""
                                            className="user_img"
                                        />
                                        <UserName>{currentUser.name}</UserName>
                                    </UserProfile>
                                </UserActions>
                            ) : (
                                <Link
                                    to="/signin"
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <SignInBtn>
                                        <SignInIcon>
                                            <TbUserCircle />
                                        </SignInIcon>
                                        <SignInBtnText>Sign in</SignInBtnText>
                                    </SignInBtn>
                                </Link>
                            )}
                        </UserDetails>
                    </RightContainer>
                </HeaderWrapper>
            </HeaderContainer>
            {open && <ListeningModal setInput={setInput} setOpen={setOpen} />}
            {openUploadModal && (
                <Upload setOpenUploadModal={setOpenUploadModal} />
            )}
        </>
    );
};

export default Header;
