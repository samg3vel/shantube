import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from '../components/Card';
import axios from 'axios';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`

function Home({ type }) {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getVideos = async () => {
            const response = await axios.get(`videos/${type}`);
            setVideos(response.data);
        }
        getVideos();
    }, [type])

    return (
        <Container>
            {videos && videos.map(v => {
                return <Card key={v._id} video={v} />;
            })}
        </Container>
    );
}

export default Home;