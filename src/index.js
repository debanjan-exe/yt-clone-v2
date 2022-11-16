import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { ChakraProvider } from "@chakra-ui/react";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ChakraProvider>
            <BrowserRouter>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <App />
                    </PersistGate>
                </Provider>
            </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>
);
