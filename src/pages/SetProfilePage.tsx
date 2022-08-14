import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import toast, { Toaster } from 'react-hot-toast';
import CubeLoader from '../components/CubeLoader';
import axios from 'axios';


const apiKey='bngqa9h6z2le0s'
function SetProfilePage() {

    const getProfileImageAPI = `https://api.multiavatar.com/`;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const getProfileImage=async()=>{
        const randomNumber=(Math.random()*10e9)|0
        const profileImageUrl=`${getProfileImageAPI}${randomNumber}?apikey=${apiKey}`
        const res= await axios.get(profileImageUrl)
    }

    return (<>
        <div>SetProfilePage</div>
        {isLoading ? <CubeLoader /> : <Container>
            <div className="title-container">
                <h1>Pick your profile image</h1>
            </div>
            <div className="profile-images">

            </div>
        </Container>}

        <Toaster />

    </>
    )
}

const Container = styled.div``

export default SetProfilePage