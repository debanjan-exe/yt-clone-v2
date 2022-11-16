import styled from "@emotion/styled";
import React from "react";
import { categories } from "./data";

const CategoryBarDiv = styled.div`
    padding: 0.5rem 18px;
    display: flex;
    overflow-x: scroll;

    @media only screen and (max-width: 768px) {
        padding: 0.5rem 0px;
    }

    &::-webkit-scrollbar {
        display: none;
    }
`;

const Category = styled.span`
    margin-right: 1rem;
    padding: 0.2rem 0.9rem;
    white-space: nowrap;
    background-color: #2e2e2e;
    color: white;
    border-radius: 10px;
    cursor: pointer;

    &:first-of-type {
        background-color: rgba(255, 255, 255, 0.907);
        color: #2e2e2e;
    }

    @media only screen and (max-width: 768px) {
        margin-right: 0.5rem;
        padding: 0.2rem 0.5rem;
    }
`;

const CategoriesBar = () => {
    return (
        <CategoryBarDiv>
            {categories.map((cat) => (
                <Category key={cat.id}>{cat.category}</Category>
            ))}
        </CategoryBarDiv>
    );
};

export default CategoriesBar;
