import React, { useState, useEffect, useContext } from "react"

import { makeStyles } from "@mui/material/styles"
import { Grid, Typography } from "@mui/material"
import { Card, CardContent, CardHeader } from '@mui/material';
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom';

import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"

import AlertMessage from "components/utils/AlertMessage"

import { getUser } from "lib/api/user_name"
import { GetUserResponse } from "interfaces/user"

import { AuthContext } from "App"

// ユーザー一覧ページ
const Themes: React.FC = () => {
  const initialUserState: GetUserResponse = {
    userId: 0,
    name: "test_name",
    image: "test_image"
  }

  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<GetUserResponse>(initialUserState)

  const { user_name } = useParams<{ user_name: string }>()

  // ユーザー一覧を取得
  const handleGetUser = async () => {
    try {
      const res = await getUser(user_name as string)

      if (res?.status === 200) {
        setUser(res?.data.user)
      } else {
        console.log("No User")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    handleGetUser()
  }, [])

  return (
    <>
      {
        !loading ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p>ユーザー名: {user.name}</p>
              </Grid>
              {
                user.themes?.map((theme: any, index: number) => {
                  const updatedAtDate = new Date(theme.updatedAt);
                  const formattedDate = `${updatedAtDate.getFullYear()}/${(updatedAtDate.getMonth() + 1).toString().padStart(2, '0')}/${updatedAtDate.getDate().toString().padStart(2, '0')} ${updatedAtDate.getHours().toString().padStart(2, '0')}:${updatedAtDate.getMinutes().toString().padStart(2, '0')}`;
                  return (
                    <Grid item xs={12} key={index}>
                      <Card className={`status-${theme.postStatus}`}>
                        <CardHeader
                          avatar={<Avatar alt="avatar" src={user.image} />}
                          title={
                            <Typography variant="body2" component="p" gutterBottom>
                              <Link to={`/${user.name}`} style={{ color: 'black', textDecoration: 'none' }}>
                                {user.name} {formattedDate}
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
                    </Grid>
                  );
                })
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

export default Themes