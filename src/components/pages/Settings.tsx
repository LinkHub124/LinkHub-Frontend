import React, { useState, useEffect, useContext } from "react"

import { makeStyles } from "@mui/material/styles"
import { Grid, Typography } from "@mui/material"
import { Card, CardContent, CardHeader } from '@mui/material';
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom';

import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"

import AlertMessage from "components/utils/AlertMessage"

import { putUser } from "lib/api/user_name"
import { GetUserResponse } from "interfaces/user"

import { PutUserRequest } from "interfaces/user"
import { useNavigate } from 'react-router-dom'

import { AuthContext } from "App"

// ユーザー一覧ページ
const Settings: React.FC = () => {

  const { currentUser } = useContext(AuthContext)

  const [loading, setLoading] = useState<boolean>(true)
  const [name, setName] = useState<string>("")
  const [currentUserName, setCurrentUserName] = useState<string>("")
  const [image, setImage] = useState({data: "", name: ""})
  const [preview, setPreview] = useState<string>("")

  const navigate = useNavigate()

  const handleImageSelect = (e: any) => {
    const reader = new FileReader()
    const files = (e.target as HTMLInputElement).files
    if (files) {
      if(!files[0]) return;
      reader.onload = () => {
        setImage({
          data: reader.result as string,
          name: files[0] ? files[0].name : "unknownfile"
        })
      }
      reader.readAsDataURL(files[0])
      setPreview(window.URL.createObjectURL(files[0]))
    }
  }

  const handleUserNameChange = (e: any) => {
    setName(e.target.value);
  };

  const handleUpdateUser = async () => {
    const data: PutUserRequest = {
      name: name,
      image: image
    }

    try {
      const res = await putUser(currentUserName, data)
      console.log(res)

      if (res?.status === 200) {
        console.log(res?.data)
        console.log("Updated")
        navigate(`/${name}`)
      } else {
        console.log("No themes")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    if(currentUser) {
      setName(currentUser.name)
      setCurrentUserName(currentUser.name)
      setLoading(false)
    }
  }, [currentUser])

  return (
    <>
      {
        !loading ? (
          <>
            <Grid container sx={{ width: 960, p: 5 }}>
              <Grid item xs={3}>
                <>
                  <p>ユーザー名変更</p>
                  <input
                    type="text"
                    value={name}
                    onChange={handleUserNameChange}
                  />
                  <input
                    type="file"
                    onChange={handleImageSelect} 
                  />
                  <Button onClick={handleUpdateUser}>更新</Button>
                </>
              </Grid>
              {
              preview ? (
                <Box>
                  <img
                    src={preview}
                    alt="preview img"
                  />
                </Box>
              ) : null
            }
            </Grid>
          </>
        ) : (
          <></>
        )
      }
    </>
  )
}

export default Settings