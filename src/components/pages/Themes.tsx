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
import { GetThemesResponse, PostThemeRequest, PostThemeResponse } from "interfaces/theme"
import { User } from "interfaces/user"

import { AuthContext } from "App"

import { Link } from 'react-router-dom';

// テーマ一覧ページ
const Themes: React.FC = () => {
  const { currentUser } = useContext(AuthContext)

  const [loading, setLoading] = useState<boolean>(true)
  const [responseData, setResponseData] = useState<GetThemesResponse[]>([])
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
        setResponseData(res?.data.themes)
        console.log(responseData);
      } else {
        console.log("No Data")
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    handleGetThemes()
  }, [])

  return (
    <>
      {
        !loading ? (
          responseData?.length > 0 ? (
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
                responseData?.map((theme: GetThemesResponse, index) => {
                  const updatedAtDate = new Date(theme.updatedAt);
                  const formattedDate = `${updatedAtDate.getFullYear()}/${(updatedAtDate.getMonth() + 1).toString().padStart(2, '0')}/${updatedAtDate.getDate().toString().padStart(2, '0')} ${updatedAtDate.getHours().toString().padStart(2, '0')}:${updatedAtDate.getMinutes().toString().padStart(2, '0')}`;

                  return (
                    <Grid item xs={12} key={index}>
                      <Card>
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
                            <Link to={`/${theme.user.name}/themes/${theme.themeId}`} style={{ color: 'black', textDecoration: 'none' }}>
                              {theme.title}
                            </Link>
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