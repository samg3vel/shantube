import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from './Card';

const Container = styled.div`
    flex: 2;
`

function Recomendation({ tags }) {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoRes = await axios.get(`/videos/tag?tags=${tags}`);
                setVideos(videoRes.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [tags])

    return (
        <Container>
            {videos && videos.map((card) =>
                (<Card type="sm" key={card._id} video={card} />)
            )}
        </Container>
    );
}

export default Recomendation;