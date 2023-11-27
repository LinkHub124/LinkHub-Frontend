import React, { useState, useEffect, useContext } from "react"
import { Grid, Paper, TextField, Button } from '@mui/material';

import { makeStyles } from "@mui/material"
import { Typography } from "@mui/material"
import { Card, CardContent, CardHeader } from '@mui/material'
import { useNavigate } from 'react-router-dom'


import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';


import { postTheme } from "lib/api/themes"
import { PostThemeRequest } from "interfaces/theme"

import { AuthContext } from "App"



// テーマ作成ページ
const NewTheme: React.FC = () => {
  const { currentUser } = useContext(AuthContext)

  const [themeTitle, setThemeTitle] = useState<string>("")

  const navigate = useNavigate()

  // テーマ作成
  const handleCreateTheme = async () => {
    const data: PostThemeRequest = {
      title: themeTitle
    }

    try {
      const res = await postTheme(data)
      console.log(res)

      if (res?.status === 200) {
        console.log("OK")
        const id = res?.data.theme.themeId
        navigate(`/themes/${id}`)
      } else {
        console.log("Failed")
      }

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Paper elevation={3} sx={{ p: 2, maxWidth: 400, mx: 'auto', textAlign: 'center', my: 5 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          新規テーマ作成
        </Typography>
        <TextField
          fullWidth
          label="タイトル"
          variant="outlined"
          margin="normal"
          onChange={(e) => setThemeTitle(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleCreateTheme}
        >
          テーマを作成
        </Button>
      </Paper>
    </>
  )
}

export default NewTheme