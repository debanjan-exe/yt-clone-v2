import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import Lottie from "lottie-react";
import microPhone from "../assets/animations/microphone.json";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 10;
    left: 0;
    background-color: #000000a7;
    position: fixed;
    z-index: 1;
    display: flex;
    align-items: start;
    justify-content: center;
`;

const Wrapper = styled.div`
    border-radius: 10px;
    width: 600px;
    height: 300px;
    background-color: ${({ theme }) => theme.bgLighter};
    color: ${({ theme }) => theme.text};
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    /* gap: 20px; */
    position: relative;
    overflow: hidden;
`;

const Close = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    z-index: 1;
    border-radius: 50%;
    padding: 5px;

    &:hover {
        background: #2e2e2e;
    }
`;

const Title = styled.p`
    /* text-align: center; */
    font-size: 24px;
`;

const Animation = styled.div`
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 20;
    width: 100%;
    height: 200px;
`;

const ListeningModal = ({ setInput, setOpen }) => {
    const [voiceInp, setVoiceInp] = useState("");
    const voiceRef = useRef(null);
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition({
        commands: [
            {
                command: "reset",
                callback: () => resetTranscript(),
            },
            {
                command: "stop listening",
                callback: () => {
                    SpeechRecognition.stopListening();
                    setInput(voiceInp.split("stop listening")[0]);
                    setOpen(false);
                },
            },
        ],
    });

    useEffect(() => {
        SpeechRecognition.startListening({ continuous: true });
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickOutside = (e) => {
        if (!voiceRef.current.contains(e.target)) {
            SpeechRecognition.stopListening();
            setOpen(false);
        }
    };

    useEffect(() => {
        console.log(transcript);
        setVoiceInp(transcript);
    }, [transcript]);

    if (!browserSupportsSpeechRecognition) {
        return alert("Browser doesn't support speech recognition");
    }

    return (
        <Container>
            <Wrapper ref={voiceRef}>
                <Close
                    onClick={() => {
                        SpeechRecognition.stopListening();
                        setOpen(false);
                        setInput(voiceInp);
                    }}
                >
                    <CloseIcon />
                </Close>
                <Title>{listening ? "Listening.." : "Not Listening.."}</Title>
                <Animation>
                    <Lottie
                        animationData={microPhone}
                        loop={true}
                        style={{
                            // backgroundColor: "red",
                            width: 250,
                            height: 250,
                            resizeMode: "contain",
                        }}
                    />
                </Animation>

                <p>{transcript}</p>
            </Wrapper>
        </Container>
    );
};

export default ListeningModal;
