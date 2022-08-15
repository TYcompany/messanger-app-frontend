import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import axios from 'axios';

import toast, { Toaster } from 'react-hot-toast';
import CubeLoader from '../components/CubeLoader';
import { FetchProfileImagesRoute } from '../lib/api/APIRoutes'
import {Buffer} from 'buffer'

function SetProfilePage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProfileImage, setSelectedProfileImage] = useState(0)
    const [profileBuffers, setProfileBuffers] = useState<string[]>([]);

    useEffect(() => {
        const fetchProfileImages = async () => {
            setIsLoading(true)
            const res = await axios.get(FetchProfileImagesRoute + '/4')
            const results = [];
            for (const image of res.data) {
                const buffer = Buffer.from(image);
                results.push(buffer.toString('base64'))
            }

            setProfileBuffers(results)
            setIsLoading(false)
        }
        fetchProfileImages()
    }, [])

    return (<>
        <div>SetProfilePage</div>
        {isLoading ? <CubeLoader /> : <Container>
            <div className="title-container">
                <h1>Pick your profile image</h1>
            </div>

            <div className="profile-images">
                {profileBuffers.map((profileBuffer, index) => <div key={'profile-image' + index} className={`profile-image ${selectedProfileImage === index && 'selected'}`}>
                    <img
                        src={`data:image/svg+xml;base64,${profileBuffer}`}
                        alt={"profile"+index}
                        onClick={() => setSelectedProfileImage(index)}
                    />
                </div>)}
            </div>
        </Container>}

        <Toaster />

    </>
    )
}

const Container = styled.div`
    display:flex ;
    justify-content:center ;
    align-items: center ;
    flex-direction:column ;
    gap:3rem;
    background-color:#131324 ;
    height:100vh;
    width:100vw;
    .title-container{
        h1{
            color:white;
        }
    }
    .profile-images{
        display:flex ;
        gap:2rem;
        .profile-image{
            border:0.4rem solid transparent;
            img{
                height:6rem;
            }
        }
    }



`

export default SetProfilePage