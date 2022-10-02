import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Comment from './Comment';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ClassNames from 'classnames';
const Container = styled.div``

const NewComment = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
`
const Avatar = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #999;
    flex: none;
    margin-right: 10px;
    opacity: 1;
`

const TextAction = styled.div`
    width: 93.8%;
    display: flex;
    flex-direction: column;
    min-height: 60px;
`

const Input = styled.input`
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.soft};
    background-color: transparent;
    outline: none;
    padding: 5px;
    width: 99%;
    color: ${({ theme }) => theme.text};
    &:focus {
        border-bottom: 3px solid ${({ theme }) => theme.highlight};
    }
    &::after, &::before {
        top: 0;
        left: 0;
        width: 100%;
        transform-origin: center;
        border-bottom: 3px solid ${({ theme }) => theme.highlight};
        transform: scale3d(0,1,1);
    }
    &:focus::before, &:focus::after {
        transform: scale3d(1,1,1);
        transition: transform 3s;
    } 
`

const ButtonContainer = styled.div`
    text-align: right;
`

const CommentButton = styled.button`
    background-color:rgba(255, 255, 255, 0.1);
    color:#909090;
    border-radius: 3px;
    float: right;
    font-size: 17px;
    margin-top: 5px;
    margin-left: 10px;
    border: none;
    padding: 5px 10px;
    font-weight: 400;
    cursor: pointer;
    &.active {
        background-color:${({ theme }) => theme.active};
        color: ${({ theme }) => theme.activeText};
    }
`

const CancelButton = styled.button`
    background-color: transparent;
    color:#606060;
    border-radius: 3px;
    float: right;
    font-size: 17px;
    margin-top: 5px;
    border: none;
    padding: 5px 10px;
    font-weight: 400;
    cursor: pointer;
`

function Comments({ videoId }) {

    const { currentUser } = useSelector(state => state.user);
    const [comments, setComments] = useState([]);
    const [userComment, setUserComment] = useState('');
    const [userCommentFocus, setUserCommentFocus] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const commentsResponse = await axios.get(`/comments/${videoId}`);
                setComments(commentsResponse.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [videoId])

    const handleCommentSubmit = async () => {
        if (userComment) {
            const added = await axios.post("/comments", { desc: userComment, videoId });
            const commentsResponse = await axios.get(`/comments/${videoId}`);
            setComments(commentsResponse.data);
            if (added.data) {
                setUserComment("");
            }
        }
    }

    const activeClass = ClassNames({ "active": !!userComment })

    return (
        <Container>
            <NewComment>
                <Avatar src={currentUser.img} />
                <TextAction>
                    <Input onFocus={() => setUserCommentFocus(true)} onChange={(e) => setUserComment(e.target.value)} value={userComment} placeholder='Add a comment...' />
                    {userCommentFocus && <ButtonContainer>
                        <CommentButton className={activeClass} onClick={handleCommentSubmit}>Comment</CommentButton>
                        <CancelButton onClick={() => { setUserComment(""); setUserCommentFocus(false) }}>Cancel</CancelButton>
                    </ButtonContainer>}
                </TextAction>
            </NewComment>
            {comments.map(comment => {
                return <Comment key={comment._id} {...comment} />
            })}
        </Container>
    );
}

export default Comments;