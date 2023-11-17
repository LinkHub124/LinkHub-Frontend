import React, { useState, useEffect, useContext } from "react"

import { makeStyles } from "@mui/material"
import { Grid, Typography } from "@mui/material"
import { Card, CardContent, CardHeader } from '@mui/material'
import { useNavigate } from 'react-router-dom'


import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

import Favorite from '@mui/icons-material/Favorite';
import Switch from '@mui/material/Switch';


import Chip from '@mui/material/Chip';
import LocationOn from '@mui/icons-material/LocationOn';

import { grey } from '@mui/material/colors';


import { Dialog } from "@mui/material"
import { DialogContent } from "@mui/material"

import { Avatar, Button, Divider } from "@mui/material"

import AlertMessage from "components/utils/AlertMessage"

import { getThemes, postTheme } from "lib/api/themes"
import { postFavorite, deleteFavorite } from "lib/api/favorites"
import { GetThemesResponse, PostThemeRequest } from "interfaces/theme"

import { AuthContext } from "App"

import { Link } from 'react-router-dom';





export interface ThemeCardType {
  index: number
  theme: GetThemesResponse
  formattedDate: string
  currentUser: any
  handleDeleteFavorite: any
  handleCreateFavorite: any
}


const ThemeCard: React.FC<ThemeCardType> = ({ index, theme, formattedDate, currentUser, handleDeleteFavorite, handleCreateFavorite }) => {
  return(
    <Box sx={{ p: 2, display: 'flex' }} className={`status-${theme.postStatus}`} key={index}>
      <Avatar variant="rounded" src={theme.user.image} sx={{ marginRight: '10px' }} />
      <Stack spacing={0.5}>
        <Typography sx={{ fontWeight: 'bold', fontFamily: 'san-serif' }}>
          <Link to={`/themes/${theme.themeId}`} style={{ color: 'black', textDecoration: 'none' }}>
          {theme.title}
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {theme.user.name} {formattedDate}
        </Typography>
      </Stack>
      {currentUser ? (
        theme.favorite.hasFavorite ? (
          <IconButton size="small" onClick={() => handleDeleteFavorite(theme.themeId)}>
            <Favorite fontSize="small" />
          </IconButton>
        ) : (
          <IconButton size="small" onClick={() => handleCreateFavorite(theme.themeId)}>
            <Favorite fontSize="small" />
          </IconButton>
        )
      ) : null}
    </Box>
  );
};


// テーマ一覧ページ
const Themes: React.FC = () => {
  const { currentUser } = useContext(AuthContext)

  const [loading, setLoading] = useState<boolean>(true)
  const [themes, setThemes] = useState<GetThemesResponse[]>([])
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

  // テーマ一覧を取得
  const handleGetThemes = async () => {
    try {
      const res = await getThemes()
      console.log(res)

      if (res?.status === 200) {
        setThemes(res?.data.themes)
        console.log(themes);
      } else {
        console.log("No Data")
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  // いいね作成
  const handleCreateFavorite = async (themeId: number) => {
    try {
      const res = await postFavorite(themeId)
      console.log(res)

      if (res?.status === 200) {
        console.log("OK")
        handleGetThemes()
      } else {
        console.log("Failed")
      }

    } catch (err) {
      console.log(err)
    }
  }

  // いいね削除
  const handleDeleteFavorite = async (themeId: number) => {
    try {
      const res = await deleteFavorite(themeId)
      console.log(res)

      if (res?.status === 200) {
        console.log("OK")
        handleGetThemes()
      } else {
        console.log("Failed")
      }

    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    handleGetThemes()
  }, [])

  return (
    <>
      {
        !loading ? (
          themes?.length > 0 ? (
            <Grid container justifyContent="center" alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <input
                  type="text"
                  placeholder="テーマのタイトル"
                  value={themeTitle}
                  onChange={(e) => setThemeTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <button onClick={handleCreateTheme}>テーマを作成</button>
              </Grid>
              <Card>
                {
                  themes?.map((theme: GetThemesResponse, index) => {
                    const updatedAtDate = new Date(theme.updatedAt);
                    const formattedDate = `${updatedAtDate.getFullYear()}/${(updatedAtDate.getMonth() + 1).toString().padStart(2, '0')}/${updatedAtDate.getDate().toString().padStart(2, '0')} ${updatedAtDate.getHours().toString().padStart(2, '0')}:${updatedAtDate.getMinutes().toString().padStart(2, '0')}`;
                    return (
                      <>
                        {index > 0 && <Divider />}
                        <ThemeCard 
                          key={index}
                          index={index}
                          theme={theme}
                          formattedDate={formattedDate}
                          currentUser={currentUser}
                          handleDeleteFavorite={handleDeleteFavorite}
                          handleCreateFavorite={handleCreateFavorite}
                        />
                      </>
                    );
                  })
                }
              </Card>
            </Grid>
          ) : (
            <Typography
              component="p"
              variant="body2"
              color="textSecondary"
            >
              <Grid item xs={12}>
                <input
                  type="text"
                  placeholder="テーマのタイトル"
                  value={themeTitle}
                  onChange={(e) => setThemeTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <button onClick={handleCreateTheme}>テーマを作成</button>
              </Grid>
              まだ1つも投稿がありません。
            </Typography>
          )
        ) : (
          <></>
        )
      }
    </>
  )
}

export default Themes