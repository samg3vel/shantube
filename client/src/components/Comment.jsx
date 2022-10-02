import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'timeago.js';
import axios from 'axios';

const Container = styled.div`
    display: flex;
    gap: 10px;
    margin: 30px 0px;
`

const Avatar = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #999;
`

const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;   
    color: ${({ theme }) => theme.text};
`

const Name = styled.span`
    font-size: 13px;
    font-weight: 500;
`
const Date = styled.span`
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.textSoft};
    margin-left: 5px;
`
const Texts = styled.span`
    font-size: 14px;
`

function Comment({ desc, userId, createdAt }) {
    const [channel, setChannel] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const commentsResponse = await axios.get(`/users/find/${userId}`);
                setChannel(commentsResponse.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [userId])

    return (
        <Container>
            <Avatar src={channel.img} />
            <Details>
                <Name>{channel.name} <Date>{format(createdAt)}</Date></Name>
                <Texts>
                    {desc}
                </Texts>
            </Details>
        </Container>
    );
}

export default Comment;