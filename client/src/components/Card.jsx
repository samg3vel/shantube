import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import styled from 'styled-components';
import { format } from 'timeago.js'
import axios from 'axios';

const Container = styled.div`
    width: ${({ type }) => type !== "sm" && "360px"};
    margin-bottom: ${({ type }) => type === "sm" ? "10px" : "45px"};
    cursor: pointer;
    display: ${({ type }) => type === "sm" && "flex"};
    gap: 10px;
`

const Image = styled.img`
    width: 100%;
    height: ${({ type }) => type === "sm" ? "120px" : "202px"};
    background-color: #999;
    flex: ${({ type }) => type === "sm" && "1"};
    min-width: 227px;
`

const Details = styled.div`
    display: flex;
    margin-top: ${({ type }) => type !== "sm" && "16px"};
    gap: 12px;
    flex: ${({ type }) => type === "sm" && "1"};
`

const ChannelImage = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #999;
    display: ${({ type }) => type === "sm" && "none"};
`

const Texts = styled.div`
    
`

const Title = styled.h1`
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
`

const ChannelName = styled.h2`
    font-size: 14px;
    color: ${({ theme }) => theme.text};
    margin: 9px 0px;
`

const Info = styled.div`
    font-size: 14px;
    color:${({ theme }) => theme.textSoft};
`

function Card({ type, video }) {
    const [channel, setChannel] = useState({});

    useEffect(() => {
        const fetchChannel = async () => {
            const response = await axios.get(`/users/find/${video.userId}`);
            setChannel(response.data)
        }
        fetchChannel();
    }, [video.userId])

    return (
        <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
            <Container type={type}>
                <Image type={type} src={video.imgUrl} />
                <Details type={type}>
                    <ChannelImage type={type} src={channel.img} />
                    <Texts>
                        <Title>{video.title}</Title>
                        <ChannelName>{channel.name}</ChannelName>
                        <Info>{video.views} views • {format(video.createdAt)}</Info>
                    </Texts>
                </Details>
            </Container>
        </Link>
    );
}

export default Card;