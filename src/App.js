import "./App.scss";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Sidebar from "./components/sidebar/Sidebar";
import HomePage from "./pages/HomePage";
import VideoPage from "./pages/VideoPage";
import SignInPage from "./pages/SignInPage";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { darkTheme, lightTheme } from "./utils/Theme";
import styled, { ThemeProvider } from "styled-components";
import SearchPage from "./pages/SearchPage";
import ChannelPage from "./pages/ChannelPage";

const MainAppContainer = styled.div``;

const AppContainer = styled.div`
    position: relative;
    display: flex;
    height: 93.5vh;
`;
const ContentContainer = styled.div`
    width: 100%;
    overflow-y: scroll;
    // padding: 40px;

    @media only screen and (max-width: 768px) {
        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

function App() {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <MainAppContainer>
                <Header
                    setOpenSidebar={setOpenSidebar}
                    openSidebar={openSidebar}
                />
                <AppContainer>
                    <Sidebar
                        setOpenSidebar={setOpenSidebar}
                        openSidebar={openSidebar}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                    />
                    <ContentContainer>
                        <Container fluid>
                            <Routes>
                                <Route path="/">
                                    <Route
                                        index
                                        element={<HomePage type="random" />}
                                    />
                                    <Route
                                        path="trend"
                                        element={<HomePage type="trend" />}
                                    />
                                    <Route
                                        path="subscriptions"
                                        element={<HomePage type="sub" />}
                                    />
                                    <Route
                                        path="search"
                                        element={<SearchPage />}
                                    />
                                    <Route
                                        path="signin"
                                        element={<SignInPage />}
                                    />
                                    <Route path="video">
                                        <Route
                                            path=":id"
                                            element={<VideoPage />}
                                        />
                                    </Route>
                                    <Route
                                        path="videos/channel/:id"
                                        element={<ChannelPage />}
                                    />
                                </Route>
                            </Routes>
                        </Container>
                    </ContentContainer>
                </AppContainer>
            </MainAppContainer>
        </ThemeProvider>
    );
}

export default App;
