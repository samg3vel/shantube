import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase.js";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #00000091;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
`
const Wrapper = styled.div`
    width: 600px;
    height: 600px;
    background-color:${({ theme }) => theme.bgLighter};
    color:${({ theme }) => theme.text};
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
`
const Close = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
`
const Title = styled.h1`
    text-align: center;
`
const Input = styled.input`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`
const Desc = styled.textarea`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`
const Button = styled.button`
    border-radius: 3px;
    border: none;
    padding: 10px 20px;
    font-weight: 500;
    cursor: pointer;
    background-color: ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.textSoft};
`
const Label = styled.label`
    font-size:14px;
`

const UploadSuccess = styled.div`
    
`

const UploadCancel = styled.button`
    float: right;
`

function Upload({ setOpen }) {
    const [img, setImg] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [imgPercent, setImgPercent] = useState(0);
    const [videoPercent, setVideoPercent] = useState(0);
    const [inputs, setInputs] = useState({});
    const [tags, setTags] = useState("");
    const navigate = useNavigate();

    const handleTags = (e) => {
        setTags(e.target.value.split(","));
    }

    const handleChange = (name, value) => {
        setInputs((prev) => {
            return { ...prev, [name]: value }
        });
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        const res = await axios.post("/videos", { ...inputs, tags })
        setOpen(false);
        res.status === 200 && navigate(`/video/${res.data._id}`)
    }

    const UploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                urlType === "imgUrl" ? setImgPercent(progress) : setVideoPercent(progress);
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log(urlType + ' File available at', downloadURL);
                    handleChange(urlType, downloadURL);
                });
            }
        );
    };

    useEffect(() => { video && UploadFile(video, "videoUrl") }, [video]);
    useEffect(() => { img && UploadFile(img, "imgUrl") }, [img]);

    return (
        <Container>
            <Wrapper>
                <Close onClick={() => setOpen(false)}>X</Close>
                <Title>Upload a New Video</Title>
                <Label>Video:</Label>
                {videoPercent > 0
                    ? (<UploadSuccess>
                        {videoPercent == 100 ? "Upload Done" : ("Uploading: " + Math.round(videoPercent))}
                        {videoPercent == 100 && <UploadCancel onClick={() => { handleChange("videoUrl", undefined); setVideoPercent(0); }}>Cancel</UploadCancel>}
                    </UploadSuccess>)
                    : (<Input type="file" accept='video/*' onChange={(e) => setVideo(e.target.files[0])} />)
                }
                <Input type="text" placeholder='Title' name="title" onChange={(e) => handleChange(e.target.name, e.target.value)} />
                <Desc placeholder='Description' rows={8} name="desc" onChange={(e) => handleChange(e.target.name, e.target.value)} />
                <Input type="text" placeholder='Seperate the tags with commas' onChange={handleTags} />
                <Label>Image:</Label>
                {imgPercent > 0
                    ? (<UploadSuccess>
                        {imgPercent == 100 ? "Upload Done" : ("Uploading: " + Math.round(imgPercent))}
                        {imgPercent == 100 && <UploadCancel onClick={() => { handleChange("imgUrl", undefined); setImgPercent(0); }}>Cancel</UploadCancel>}
                    </UploadSuccess>)
                    : (<Input type="file" accept='image/*' onChange={(e) => setImg(e.target.files[0])} />)
                }
                <Button onClick={handleUpload}>Upload</Button>
            </Wrapper>
        </Container>
    );
}

export default Upload;