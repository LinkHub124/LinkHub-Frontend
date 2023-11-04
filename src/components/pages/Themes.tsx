import React, { useState, useEffect, useContext } from "react"

import { makeStyles } from "@material-ui/core/styles"
import { Grid, Typography } from "@material-ui/core"
import { Card, CardContent, CardHeader } from '@material-ui/core';


import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"

import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import FavoriteIcon from "@material-ui/icons/Favorite"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"

import AlertMessage from "components/utils/AlertMessage"

import { getThemes, postTheme } from "lib/api/themes"
import { postFavorite, deleteFavorite } from "lib/api/favorites"
import { GetThemesResponse, PostThemeRequest } from "interfaces/theme"

import { AuthContext } from "App"

import { Link } from 'react-router-dom';

// テーマ一覧ページ
const Themes: React.FC = () => {
  const { currentUser } = useContext(AuthContext)

  const [loading, setLoading] = useState<boolean>(true)
  const [themes, setThemes] = useState<GetThemesResponse[]>([])
  const [themeTitle, setThemeTitle] = useState<string>("")

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
            <Grid container justify="center" spacing={2}>
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
              {
                themes?.map((theme: GetThemesResponse, index) => {
                  const updatedAtDate = new Date(theme.updatedAt);
                  const formattedDate = `${updatedAtDate.getFullYear()}/${(updatedAtDate.getMonth() + 1).toString().padStart(2, '0')}/${updatedAtDate.getDate().toString().padStart(2, '0')} ${updatedAtDate.getHours().toString().padStart(2, '0')}:${updatedAtDate.getMinutes().toString().padStart(2, '0')}`;
                  return (
                    <Grid item xs={12} key={index}>
                      <Card className={`status-${theme.postStatus}`}>
                        <CardHeader
                          avatar={<Avatar alt="avatar" src={theme.user.image} />}
                          title={
                            <Typography variant="body2" component="p" gutterBottom>
                              <Link to={`/${theme.user.name}`} style={{ color: 'black', textDecoration: 'none' }}>
                                {theme.user.name} {formattedDate}
                              </Link>
                            </Typography>
                          }
                        />
                        <CardContent>
                          <Typography variant="body1" component="p">
                            <Link to={`/themes/${theme.themeId}`} style={{ color: 'black', textDecoration: 'none' }}>
                              {theme.title}
                            </Link>
                            {currentUser ? (
                              theme.favorite ? (
                                <Button onClick={() => handleDeleteFavorite(theme.themeId)}>いいね削除</Button>
                              ) : (
                                <Button onClick={() => handleCreateFavorite(theme.themeId)}>いいねする</Button>
                              )
                            ) : null}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })
              }
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