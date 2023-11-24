import React, { useState, useEffect, useContext } from "react"

import { makeStyles } from "@mui/material/styles"
import { Grid, Typography } from "@mui/material"
import { Card, CardContent, CardHeader } from '@mui/material'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useParams } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import Box from "@mui/material/Box"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"

import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"

import AlertMessage from "components/utils/AlertMessage"

import { getTheme, putTheme, deleteTheme } from "lib/api/themes"
import { postLinkCollections, deleteLinkCollections } from "lib/api/link_collections"
import { GetThemeResponse, PutThemeRequest } from "interfaces/theme"
import { PostLinkCollectionRequest, PostLinkCollectionRequestLink } from "interfaces/link_collection"

import { AuthContext } from "App"

import { Link } from 'react-router-dom'

export interface OgpLinkCardType {
  link: any
}

const OgpLinkCard: React.FC<OgpLinkCardType> = ({ link }) => {
  const getTld = (url: string) => {
    let modifiedUrl = url;
    const sz = url.length;
  
    if (url.startsWith('http://')) {
      modifiedUrl = url.slice(7);
    } else if (url.startsWith('https://')) {
      modifiedUrl = url.slice(8);
    }
  
    const idx = modifiedUrl.indexOf('/');
    modifiedUrl = (idx !== -1) ? modifiedUrl.slice(0, idx) : modifiedUrl;
  
    return modifiedUrl;
  };
    
  return(
    <Link to={link.url} rel="nofollow noopener" target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box
        className="one-link-card"
        sx={{
          backgroundColor: '#FFF', // bgColor の修正
          width: '100%', // width の修正
          border: '1px solid #E6E6E6', // border の修正
          borderRadius: '4px', // border-radius の修正
          marginBottom: '12px', // margin-bottom の修正
          ':hover': {
            backgroundColor: '#FFF',
            width: '100%',
            border: '1px solid #555',
            borderRadius: '4px',
          },
        }}
      >
        <Box className="one-link-content" sx={{ display: 'flex', alignItems: 'center' }}>
          <Box className="one-link-left" sx={{ flex: 1, padding: '16px' }}>
            <Box component="strong" className="one-link-title" sx={{
              display: '-webkit-box',
              maxHeight: '3em',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}>{link.urlTitle}</Box>

            <Box component="span" className="one-link-description" sx={{
              display: '-webkit-box',
              maxheight: '3em',
              overflow: 'hidden',
              color: '#6F7372',
              wordBreak: 'break-all',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}>
              {link.urlDescription}
            </Box>
            <Box component="span" className="one-link-url" sx={{
              display: '-webkit-box',
              maxheight: '3em',
              overflow: 'hidden',
              color: '#6F7372',
              wordBreak: 'break-all',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}>
              {getTld(link.url)}
            </Box>
          </Box>
          <Box className="one-link-right one-link-image" sx={{
            width: '225px',
            height: '150px',
            verticalAlign: 'middle', // キャメルケースに修正
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50%',
            backgroundSize: 'cover',
            borderLeft: '1px solid #e8eceb',
            borderRadius: '0 3px 3px 0',
            backgroundImage: `url(${link.urlImage})`, // テンプレート文字列を使用し、URLを正しく挿入
            }}>
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

// ユーザー一覧ページ
const Themes: React.FC = () => {
  const { currentUser } = useContext(AuthContext)
  const { theme_id } = useParams<{ theme_id: string }>()
  const parsedId = parseInt(theme_id as string, 10)

  const [subtitle, setSubtitle] = useState<string>("")
  const [links, setLinks] = useState<PostLinkCollectionRequestLink[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const initialThemeState: GetThemeResponse = {
    themeId: 0,
    title: "test_name",
    postStatus: 0,
    createdAt: new Date("1990/01/01"),
    updatedAt: new Date("1990/01/01")
  }

  const [theme, setTheme] = useState<GetThemeResponse>(initialThemeState)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [postStatus, setPostStatus] = useState<string>("Private")

  const postStatusOptions: string[] = ['Private', 'Limited', 'Public']

  const navigate = useNavigate()
  

  const handleTitleClick = () => {
    setIsEditing(true)
  }

  const handleTitleChange = (e: any) => {
    setTitle(e.target.value)
  }

  const handlePostStatusChange = (e: any) => {
    setPostStatus(e.target.value)
  }

  // テーマの詳細情報を取得
  const handleGetTheme = async () => {
    try {
      const res = await getTheme(parsedId)
      console.log(res)

      if (res?.status === 200) {
        setTheme(res?.data.theme)
        setTitle(res?.data.theme.title)
        setPostStatus(postStatusOptions[res?.data.theme.postStatus])
      } else {
        console.log("No themes")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  // テーマの詳細情報を更新
  const handleUpdateTheme = async () => {
    const data: PutThemeRequest = {
      title: title,
      postStatus: postStatusOptions.indexOf(postStatus)
    }

    try {
      const res = await putTheme(parsedId, data)
      console.log(res)

      if (res?.status === 200) {
        console.log("Updated")
      } else {
        console.log("No themes")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
    setIsEditing(false);
  }

  // テーマ削除
  const handleDestroyTheme = async () => {
    try {
      const res = await deleteTheme(parsedId)
      console.log(res)

      if (res?.status === 200) {
        console.log("Deleted")
        navigate(-1)
      } else {
        console.log("No themes")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
    setIsEditing(false);
  }

  // リンク集作成
  const handleCreateLinkCollection = async () => {
    const data: PostLinkCollectionRequest = {
      subtitle: subtitle,
      links: links
    }

    try {
      const res = await postLinkCollections(parsedId, data)
      console.log(res)

      if (res?.status === 200) {
        console.log("OK")
        handleGetTheme()
        setLinks([])
      } else {
        console.log("Failed")
      }

    } catch (err) {
      console.log(err)
    }
  }

  // リンク集削除
  const handleDeleteLinkCollection = async (linkCollectionId: number) => {
    try {
      const res = await deleteLinkCollections(parsedId, linkCollectionId)
      console.log(res)

      if (res?.status === 200) {
        console.log("OK")
        handleGetTheme()
      } else {
        console.log("Failed")
      }

    } catch (err) {
      console.log(err)
    }
  }

  // リンクフォーム追加
  const handleCreateLinkForm = () => {
    setLinks([...links, { url: "" }])
  }

  // リンクフォーム削除
  const handleDeleteLinkForm = (index: number) => {
    const updatedLinks = [...links]
    updatedLinks.splice(index, 1)
    setLinks(updatedLinks)
  }

  const handleLinkChange = (e: any, index: number) => {
    const updatedLinks = [...links]
    updatedLinks[index].url = e.target.value
    setLinks(updatedLinks)
  }

  useEffect(() => {
    handleGetTheme()
  }, [])

  return (
    <>
      {
        !loading ? (
          <>
            <Grid container spacing={2} sx={{ bgColor: "blue" }}>
              <Grid item xs={12}>
                {/* 投稿内容を左側に配置 */}
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={title}
                      onChange={handleTitleChange}
                    />
                    <Select
                      value={postStatus}
                      onChange={handlePostStatusChange}
                    >
                      <MenuItem value="Private">Private</MenuItem>
                      <MenuItem value="Limited">Limited</MenuItem>
                      <MenuItem value="Public">Public</MenuItem>
                    </Select>
                    <Button onClick={handleUpdateTheme}>保存</Button>
                  </>
                ) : (
                  <h1 onClick={handleTitleClick}>{title}</h1>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ bgColor: "blue" }}>
              <Button onClick={handleDestroyTheme}>テーマを削除</Button>
                {links.map((link: PostLinkCollectionRequestLink, index: number) => (
                  <div key={index}>
                    <input
                      type="text"
                      placeholder="テーマのタイトル"
                      name="aaa"
                      value={link.url}
                      onChange={(e) => handleLinkChange(e, index)}
                    />
                    <button onClick={() => handleDeleteLinkForm(index)}>-</button>
                  </div>
                ))}
                <Button onClick={handleCreateLinkForm}>リンク集を追加</Button>
                <Button onClick={handleCreateLinkCollection}>保存</Button>
                {
                  theme.linkCollections?.map((linkCollection: any, index) => {
                    const updatedAtDate = new Date(theme.updatedAt)
                    const formattedDate = `${updatedAtDate.getFullYear()}/${(updatedAtDate.getMonth() + 1).toString().padStart(2, '0')}/${updatedAtDate.getDate().toString().padStart(2, '0')} ${updatedAtDate.getHours().toString().padStart(2, '0')}:${updatedAtDate.getMinutes().toString().padStart(2, '0')}`
                    return (
                      <Grid item xs={12} key={index}>
                        <Card>
                          <CardHeader
                            title={
                              <Typography variant="body1" component="p" gutterBottom>
                                LinkCollection: {linkCollection.subtitle}
                              </Typography>
                            }
                          />
                          <CardContent>
                            <Button onClick={() => handleDeleteLinkCollection(linkCollection.linkCollectionId)}>X</Button>
                            <Typography variant="body2" component="p">
                            {
                              linkCollection.links.map((link: any) => {
                                return (
                                  <OgpLinkCard
                                    link={link}
                                  />
                                );
                              })
                            }
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
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