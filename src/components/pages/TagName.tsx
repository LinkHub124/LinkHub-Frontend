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

import { getTag } from "lib/api/tag_name"
import { GetThemesResponse } from "interfaces/theme"

import { AuthContext } from "App"

// ユーザー一覧ページ
const TagName: React.FC = () => {
  const { currentUser } = useContext(AuthContext)

  const [loading, setLoading] = useState<boolean>(true)
  const [themes, setThemes] = useState<GetThemesResponse[]>([])

  const { tag_name } = useParams<{ tag_name: string }>()

  // タグに紐づいたテーマ一覧を取得
  const handleGetThemes = async () => {
    try {
      const res = await getTag(tag_name as string)

      if (res?.status === 200) {
        setThemes(res?.data.themes)
      } else {
        console.log("No User")
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
          <>
            <Grid container sx={{ width: 960, p: 5 }}>
              <Grid item xs={3}>
                <Card>
                  <CardContent>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Avatar variant="rounded" sx={{ m: 3, width: 100, height: 100 }} />
                      <Typography>{tag_name}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={8}>
                {
                  themes?.map((theme: any, index: number) => {
                    const updatedAtDate = new Date(theme.updatedAt);
                    const formattedDate = `${updatedAtDate.getFullYear()}/${(updatedAtDate.getMonth() + 1).toString().padStart(2, '0')}/${updatedAtDate.getDate().toString().padStart(2, '0')} ${updatedAtDate.getHours().toString().padStart(2, '0')}:${updatedAtDate.getMinutes().toString().padStart(2, '0')}`;
                    return (
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
                            </Typography>
                          </CardContent>
                        </Card>
                      
                    );
                  })
                }
              </Grid>
            </Grid>
          </>
        ) : (
          <></>
        )
      }
    </>
  )
}

export default TagName