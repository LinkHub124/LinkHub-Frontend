import React, { useState, useEffect, useContext } from "react"

import { makeStyles } from "@material-ui/core/styles"
import { Grid, Typography } from "@material-ui/core"
import { useParams } from "react-router-dom"
import Box from "@material-ui/core/Box"

import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"

import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import FavoriteIcon from "@material-ui/icons/Favorite"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"

import AlertMessage from "components/utils/AlertMessage"

import { getTheme } from "lib/api/themes"
import { Link, Theme } from "interfaces/index"

import { AuthContext } from "App"

// ユーザー一覧ページ
const Themes: React.FC = () => {
  const { currentUser } = useContext(AuthContext)
  const { theme_id } = useParams<{ theme_id: string }>()
  const parsedId = parseInt(theme_id as string, 10)

  const initialThemeState: Theme = {
    id: 0,
    title: "",
    post_status: 0
  }
  const [loading, setLoading] = useState<boolean>(true)
  const [theme, setTheme] = useState<Theme>(initialThemeState)
//   const [user, setUser] = useState<User>(initialUserState)
//   const [userDetailOpen, setUserDetailOpen] = useState<boolean>(false)
//   const [likedUsers, setLikedUsers] = useState<User[]>([])
//   const [likes, setLikes] = useState<Like[]>([])
//   const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

//   // 生年月日から年齢を計算する 年齢 = floor((今日 - 誕生日) / 10000)
//   const userAge = (): number | void => {
//     const birthday = user.birthday.toString().replace(/-/g, "")
//     if (birthday.length !== 8) return

//     const date = new Date()
//     const today = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2)

//     return Math.floor((parseInt(today) - parseInt(birthday)) / 10000)
//   }

//   // 都道府県
//   const userPrefecture = (): string => {
//     return prefectures[(user.prefecture) - 1]
//   }

//   // いいね作成
//   const handleCreateLike = async (user: User) => {
//     const data: Like = {
//       fromUserId: currentUser?.id,
//       toUserId: user.id
//     }

//     try {
//       const res = await createLike(data)
//       console.log(res)

//       if (res?.status === 200) {
//         setLikes([res.data.like, ...likes])
//         setLikedUsers([user, ...likedUsers])

//         console.log(res?.data.like)
//       } else {
//         console.log("Failed")
//       }

//       if (res?.data.isMatched === true) {
//         setAlertMessageOpen(true)
//         setUserDetailOpen(false)
//       }
//     } catch (err) {
//       console.log(err)
//     }
//   }

  // ユーザー一覧を取得
  const handleGetTheme = async () => {
    try {
      const res = await getTheme(parsedId)
      console.log(res)

      if (res?.status === 200) {
        setTheme(res?.data.theme)
      } else {
        console.log("No themes")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

//   // いいね一覧を取得
//   const handleGetLikes = async () => {
//     try {
//       const res = await getLikes()
//       console.log(res)

//       if (res?.status === 200) {
//         setLikedUsers(res?.data.activeLikes)
//       } else {
//         console.log("No likes")
//       }
//     } catch (err) {
//       console.log(err)
//     }
//   }

  useEffect(() => {
    handleGetTheme()
    // handleGetLikes()
  }, [])

//   // すでにいいねを押されているユーザーかどうかの判定
//   const isLikedUser = (userId: number | undefined): boolean => {
//     return likedUsers?.some((likedUser: User) => likedUser.id === userId)
//   }

  return (
    <>
      {
        !loading ? (
          <div style={{ maxWidth: 360 }}>
            {
              theme?.links?.map((link: Link, index: number) => {
                return (
                  <Grid key={index} container justify={true ? "flex-start" : "flex-end"}>
                    <Grid item>
                      <Box
                        borderRadius={true ? "30px 30px 30px 0px" : "30px 30px 0px 30px"}
                        bgcolor={true ? "#d3d3d3" : "#ffb6c1"}
                        color={true ? "#000000" : "#ffffff"}
                        m={1}
                        border={0}
                        style={{ padding: "1rem" }}
                      >
                        <Typography variant="body1" component="p">
                          {link.subtitle}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        component="p"
                        color="textSecondary"
                        style={{ textAlign: true ? "left" : "right" }}
                      >
                      {link.caption}
                       
                      </Typography>
                    </Grid>
                  </Grid>
                )
              })
            }
          </div>
        ) : (
          <></>
        )
      }
    </>
  )
}

export default Themes