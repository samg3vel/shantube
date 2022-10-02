import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/Card';

const Container = styled.div`
    display:flex;
    flex-wrap: wrap;
    gap: 10px;
`

function Search(props) {
    const [videos, setVideos] = useState([])
    const query = useLocation().search;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoRes = await axios.get(`/videos/search${query}`);
                setVideos(videoRes.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [query])

    return (
        <Container>
            {videos.map((video) => {
                return <Card key={video._id} video={video} />;
            })}
        </Container>
    );
}

export default Search;