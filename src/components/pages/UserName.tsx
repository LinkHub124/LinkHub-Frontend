import React, { useState, useEffect, useContext } from "react"

import { makeStyles } from "@material-ui/core/styles"
import { Grid, Typography } from "@material-ui/core"
import { useParams } from "react-router-dom"

import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import FavoriteIcon from "@material-ui/icons/Favorite"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"

import AlertMessage from "components/utils/AlertMessage"

import { getUser } from "lib/api/user_name"
import { Theme } from "interfaces/theme"
import { User } from "interfaces/user"

import { AuthContext } from "App"

// ユーザー一覧ページ
const Themes: React.FC = () => {
  const { currentUser } = useContext(AuthContext)

  const [loading, setLoading] = useState<boolean>(true)
  const [themes, setThemes] = useState<Theme[]>([])
  const initialUserState: User = {
    id: 0,
    email: "test@example.com",
    name: "test_name",
    introduction: "test_introduction"
  }
  const [user, setUser] = useState<User>(initialUserState)

  const { user_name } = useParams<{ user_name: string }>()
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
  const handleGetThemes = async () => {
    try {
      const res = await getUser(user_name as string)
      console.log(res)

      if (res?.status === 200) {
        setUser(res?.data.user)
        setThemes(res?.data.user.themes)
        console.log(themes);
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
    handleGetThemes()
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
          <>
            <p>{user.name}</p>
            <p>{user.introduction}</p>

            {
              themes?.length > 0 ? (
                <Grid container justify="center">
                  {
                    themes?.map((theme: Theme, index: number) => {
                      return (
                        <div>
                          <Grid item style={{ margin: "0.5rem", cursor: "pointer" }}>
                            {/* <Avatar
                              alt="avatar"
                              src={user?.image.url}
                              className={classes.avatar}
                            /> */}
                            <Typography
                              variant="body2"
                              component="p"
                              gutterBottom
                              style={{ marginTop: "0.5rem", textAlign: "center" }}
                            >
                              {theme.title} {theme.user?.name}
                            </Typography>
                          </Grid>
                        </div>  
                      ) 
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
            }
          </>
        ) : (
          <></>
        )
      }
      {/* <Dialog
        open={userDetailOpen}
        keepMounted
        onClose={() => setUserDetailOpen(false)}
      >
        <DialogContent>
          <Grid container justify="center">
            <Grid item>
              <Avatar
                alt="avatar"
                src={user?.image.url}
                className={classes.avatar}
              />
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item style={{ marginTop: "1rem" }}> */}
              {/* <Typography variant="body1" component="p" gutterBottom style={{ textAlign: "center" }}>
                {user.name} {userAge()}歳 ({userPrefecture()})
              </Typography> */}
              {/* <Divider />
              <Typography
                variant="body2"
                component="p"
                gutterBottom
                style={{ marginTop: "0.5rem", fontWeight: "bold" }}
              >
                自己紹介
              </Typography>
              <Typography variant="body2" component="p" color="textSecondary" style={{ marginTop: "0.5rem" }}>
                {user.profile ? user.profile : "よろしくお願いします。" }
              </Typography>
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Button
              variant="outlined"
              onClick={() => isLikedUser(user.id) ? void(0) : handleCreateLike(user)}
              color="secondary"
              startIcon={isLikedUser(user.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              disabled={isLikedUser(user.id) ? true : false}
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            >
              {isLikedUser(user.id) ? "いいね済み" : "いいね"}
            </Button>
          </Grid>
        </DialogContent>
      </Dialog> */}
      {/* <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="success"
        message="マッチングが成立しました!"
      /> */}
    </>
  )
}

export default Themes