import React, { useState } from 'react';
import styled from 'styled-components';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import Upload from './Upload';
import { logout } from '../redux/userSlice';

const Container = styled.div`
    position: sticky;
    top: 0;
    background-color: ${({ theme }) => theme.bgLighter};
    height: 56px;
`

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    padding: 0px 20px;
    position: relative;
`
const Search = styled.div`
    width: 40%;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    color: ${({ theme }) => theme.text};
`

const Input = styled.input`
    border: none;
    background-color: transparent;
    outline: none;
    width: 100%;
    color: ${({ theme }) => theme.text};
`

const Button = styled.button`
    padding: 5px 15px;
    background-color: transparent;
    border: 1px solid #3ae6ff;
    color: #3ae6ff;
    border-radius: 3px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
`

const Options = styled.div`
    display: none;
    position: absolute;
    background-color: #ff0000a7;
    color: white;
    z-index:1;
    width: max-content;
    padding: 10px 10px;
`

const UserName = styled.div`
    display: inline-block;
    position: relative;
    &:hover ${Options} {
        display: block;
    }
`

const User = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
    cursor: pointer;    
`

const Avatar = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #999;
`

function Navbar(_props) {
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const navigate = useNavigate();

    const handleClick = () => {
        dispatch(logout());
        navigate(`/signin`);
    }

    return (
        <>
            <Container>
                <Wrapper>
                    <Search>
                        <Input placeholder='Search' onChange={(e) => setQ(e.target.value)} />
                        <SearchOutlinedIcon onClick={() => navigate(`/search?q=${q}`)} />
                    </Search>
                    {currentUser ?
                        <User>
                            <VideoCallOutlinedIcon onClick={() => setOpen(true)} />
                            <Avatar src={currentUser.img} />
                            <UserName>{currentUser.name}
                                <Options onClick={handleClick}>Sign Out</Options>
                            </UserName>
                        </User>
                        : <Link to="signin" style={{ textDecoration: "none" }}>
                            <Button><AccountCircleOutlined />SIGN IN</Button>
                        </Link>}
                </Wrapper>
            </Container>
            {open && <Upload setOpen={setOpen} />}
        </>
    );
}

export default Navbar;