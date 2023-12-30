import React, { useState, useEffect, useContext } from "react"

import { makeStyles } from "@mui/material/styles"
import { Grid, Typography } from "@mui/material"
import { Card, CardContent, CardHeader, IconButton, Menu } from '@mui/material'
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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
import { postLinkCollections, putLinkCollections, deleteLinkCollections } from "lib/api/link_collections"
import { GetThemeResponse, PutThemeRequest } from "interfaces/theme"
import { PostLinkCollectionRequest, PostLinkCollectionRequestLink, PutLinkCollectionRequest } from "interfaces/link_collection"

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
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [postStatus, setPostStatus] = useState<string>("Private")
  const [theme, setTheme] = useState<GetThemeResponse>({
    themeId: 0,
    title: "test_name",
    postStatus: 0,
    user: {
      userId: 0,
      name: "test_name",
      image: "test_image"
    },
    createdAt: new Date("1990/01/01"),
    updatedAt: new Date("1990/01/01")
  })
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentLinkCollectionId, setCurrentLinkCollectionId] = useState(-1); // 現在選択されている linkCollectionId を追跡
  const initializeEditStateDict = () => {
    const editStateDict: { [key: number]: boolean } = {};
    theme.linkCollections?.map((linkCollection: any) => {
      editStateDict[linkCollection.linkCollectionId] = false; // 初期値として false（非編集状態）を設定
    })
    return editStateDict;
  };
  const [editStates, setEditStates] = useState(initializeEditStateDict());
  const [updateLinkCollectionDict, setUpdateLinkCollectionDict] = useState<{ [key: number]: PostLinkCollectionRequest }>({});

  const postStatusOptions: string[] = ['Private', 'Limited', 'Public']
  const navigate = useNavigate()

  // タイトルをクリックした時に編集状態にする
  const handleTitleClick = () => {
    if(currentUser == undefined) return
    if(theme.user.userId != currentUser.id) return
    setIsEditingTitle(true)
  }

  // テーマのタイトルを入力に応じて更新する
  const handleThemeTitleChange = (e: any) => {
    setTitle(e.target.value)
  }

  // テーマの投稿状態を入力状態に応じて更新する
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
        updateEditStates()
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
    setIsEditingTitle(false);
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
    setIsEditingTitle(false);
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
        setSubtitle("")
        setLinks([])
      } else {
        console.log("Failed")
      }

    } catch (err) {
      console.log(err)
    }
  }

  // リンク集更新
  const handleUpdateLinkCollection = async (linkCollectionId: number) => {
    const data: PutLinkCollectionRequest = {
      subtitle: updateLinkCollectionDict[linkCollectionId].subtitle,
      links: updateLinkCollectionDict[linkCollectionId].links
    }

    try {
      const res = await putLinkCollections(parsedId, linkCollectionId, data)
      console.log(res)

      if (res?.status === 200) {
        console.log("OK")
        handleGetTheme()
        toggleEditState(linkCollectionId, false)
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

  // リンク集のsubtitle修正
  const handleLinkCollectionSubtitleChange = (e: any) => {
    setSubtitle(e.target.value)
  }

  // リンクフォーム追加
  const handleCreateLinkForm = () => {
    setLinks([...links, { url: "", description: "" }])
  }

  // リンクフォーム削除
  const handleDeleteLinkForm = (index: number) => {
    const updatedLinks = [...links]
    updatedLinks.splice(index, 1)
    setLinks(updatedLinks)
  }

  // リンクフォームのurl修正
  const handleLinkUrlChange = (e: any, index: number) => {
    const updatedLinks = [...links]
    updatedLinks[index].url = e.target.value
    setLinks(updatedLinks)
  }

  // リンクフォームのdescription修正
  const handleLinkDescriptionChange = (e: any, index: number) => {
    const updatedLinks = [...links]
    updatedLinks[index].description = e.target.value
    setLinks(updatedLinks)
  }

  useEffect(() => {
    handleGetTheme()
  }, [])

  // ミートボールメニューをクリック
  const handleMeatBallMenuClick = (event: any, id: number) => {
    setAnchorEl(event.currentTarget);
    setCurrentLinkCollectionId(id); // クリックされた時点での linkCollectionId を保存
  };

  // ミートボールメニューを非表示
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 編集状態の切り替え関数
  const toggleEditState = (id: number, flag: boolean) => {
    setEditStates(prevEditStates => ({
      ...prevEditStates,
      [id]: flag
    }));
    if (flag) {
      var tmpSubtitle = ""
      var tmpLinks: any[] = []
      
      theme.linkCollections?.forEach((linkCollection: any) => {
        if (linkCollection.linkCollectionId == id) {
          tmpSubtitle = linkCollection.subtitle
          tmpLinks = linkCollection.links
        }
      });
      
      // updateLinkCollectionDictに追加
      setUpdateLinkCollectionDict(prevUpdateLinkCollectionDict => ({
        ...prevUpdateLinkCollectionDict,
        [id]: {
          subtitle: tmpSubtitle,
          links: tmpLinks
        }
      }));
    }else {
      // updateLinkCollectionDictを削除
      setUpdateLinkCollectionDict(prevUpdateLinkCollectionDict => {
        const newUpdateLinkCollectionDict = { ...prevUpdateLinkCollectionDict };
        delete newUpdateLinkCollectionDict[id];
        return newUpdateLinkCollectionDict;
      });
    }
  };

  // 
  const handleLinkCollectionDictSubtitleChange = (e: any, id: number) => {
    setUpdateLinkCollectionDict(prevUpdateLinkCollectionDict => ({
      ...prevUpdateLinkCollectionDict,
      [id]: {
        subtitle: e.target.value,
        links: updateLinkCollectionDict[id].links
      }
    }));
  };

  const handleLinkCollectionDictUrlChange = (e: any, id: number, index: number) => {
    const LinkCollectionDictLinks = [...updateLinkCollectionDict[id].links]
    LinkCollectionDictLinks[index].url = e.target.value
    setUpdateLinkCollectionDict(prevUpdateLinkCollectionDict => ({
      ...prevUpdateLinkCollectionDict,
      [id]: {
        subtitle: updateLinkCollectionDict[id].subtitle,
        links: LinkCollectionDictLinks
      }
    }));
  };

  const handleLinkCollectionDictDescriptionChange = (e: any, id: number, index: number) => {
    const LinkCollectionDictLinks = [...updateLinkCollectionDict[id].links]
    LinkCollectionDictLinks[index].description = e.target.value
    setUpdateLinkCollectionDict(prevUpdateLinkCollectionDict => ({
      ...prevUpdateLinkCollectionDict,
      [id]: {
        subtitle: updateLinkCollectionDict[id].subtitle,
        links: LinkCollectionDictLinks
      }
    }));
  };

  const handleCreateLinkCollectionDictLinkForm = (id: number) => {
    const LinkCollectionDictLinks = [...updateLinkCollectionDict[id].links, { url: "", description: "" }]
    setUpdateLinkCollectionDict(prevUpdateLinkCollectionDict => ({
      ...prevUpdateLinkCollectionDict,
      [id]: {
        subtitle: updateLinkCollectionDict[id].subtitle,
        links: LinkCollectionDictLinks
      }
    }));
  }

  const handleDeleteLinkCollectionDictLinkForm = (id: number, index: number) => {
    const LinkCollectionDictLinks = [...updateLinkCollectionDict[id].links]
    LinkCollectionDictLinks.splice(index, 1)
    setUpdateLinkCollectionDict(prevUpdateLinkCollectionDict => ({
      ...prevUpdateLinkCollectionDict,
      [id]: {
        subtitle: updateLinkCollectionDict[id].subtitle,
        links: LinkCollectionDictLinks
      }
    }));
  }

  const updateEditStates = () => {
    const linkCollectionIds = theme.linkCollections?.map(lc => lc.linkCollectionId.toString()) || [];
  
    setEditStates((prevEditStates) => {
      const newEditStates = { ...prevEditStates };
  
      // 不要なキーを削除
      Object.keys(newEditStates).forEach(key => {
        if (!linkCollectionIds.includes(key)) {
          delete newEditStates[parseInt(key, 10)];
        }
      });
  
      return newEditStates;
    });
  };

  return (
    <>
      {
        !loading ? (
          <>
            <Grid container spacing={2} sx={{ width: 960 }}>
              <Grid item xs={12}>
                {isEditingTitle ? (
                  <>
                    <input
                      type="text"
                      value={title}
                      onChange={handleThemeTitleChange}
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
                  <>
                    <h1 onClick={handleTitleClick}>{title}</h1>
                  </>
                )}
                <br/>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {
                currentUser && currentUser.id == theme.user.userId ? (
                  <>
                    <input
                      type="text"
                      placeholder="サブタイトル"
                      name="subtitle"
                      value={subtitle}
                      onChange={(e) => handleLinkCollectionSubtitleChange(e)}
                    />
                    <Button onClick={handleDestroyTheme}>テーマを削除</Button>
                    {links.map((link: PostLinkCollectionRequestLink, index: number) => (
                      <Grid item xs={12} key={index}>
                        <input
                          type="text"
                          placeholder="リンク"
                          name="url"
                          value={link.url}
                          onChange={(e) => handleLinkUrlChange(e, index)}
                        />
                        <input
                          type="text"
                          placeholder="コメント"
                          name="description"
                          value={link.description}
                          onChange={(e) => handleLinkDescriptionChange(e, index)}
                        />
                        <button onClick={() => handleDeleteLinkForm(index)}>-</button>
                      </Grid>
                    ))}
                    <Button onClick={handleCreateLinkForm}>リンク集を追加</Button>
                    <Button onClick={handleCreateLinkCollection}>保存</Button>
                  </>
                ) : (
                  <></>
                )
              }
              {
                theme.linkCollections?.map((linkCollection: any, index) => {
                  const updatedAtDate = new Date(theme.updatedAt)
                  const formattedDate = `${updatedAtDate.getFullYear()}/${(updatedAtDate.getMonth() + 1).toString().padStart(2, '0')}/${updatedAtDate.getDate().toString().padStart(2, '0')} ${updatedAtDate.getHours().toString().padStart(2, '0')}:${updatedAtDate.getMinutes().toString().padStart(2, '0')}`
                  return (
                    <Grid item xs={12}>
                      <Card>
                        <CardHeader
                          action={
                            currentUser && currentUser.id === theme.user.userId && (
                              <>
                                <IconButton aria-label="settings" onClick={(e) => handleMeatBallMenuClick(e, linkCollection.linkCollectionId)}>
                                  <MoreHorizIcon />
                                </IconButton>
                                <Menu
                                  anchorEl={anchorEl}
                                  open={Boolean(anchorEl)}
                                  onClose={handleClose}
                                >
                                  <MenuItem onClick={() => {
                                    handleClose();
                                    toggleEditState(currentLinkCollectionId, true);
                                  }}>編集</MenuItem>
                                  <MenuItem onClick={() => {
                                    handleClose();
                                    handleDeleteLinkCollection(currentLinkCollectionId);
                                  }}>削除</MenuItem>
                                </Menu>
                              </>
                            )
                          }
                          title={
                            <>
                              <Typography variant="body1" component="p" gutterBottom>
                                LinkCollection: {linkCollection.linkCollectionId}
                              </Typography>
                              <Typography variant="body1" component="p" gutterBottom>
                                Subtitle: {linkCollection.subtitle}
                              </Typography>
                            </>
                          }
                        />
                        <CardContent>
                          <Typography variant="body2" component="p">
                            {
                              editStates[linkCollection.linkCollectionId] ? (
                                <>
                                  <input
                                    type="text"
                                    placeholder="サブタイトル"
                                    name="subtitle"
                                    value={updateLinkCollectionDict[linkCollection.linkCollectionId].subtitle}
                                    onChange={(e) => handleLinkCollectionDictSubtitleChange(e, linkCollection.linkCollectionId)}
                                  />
                                  {updateLinkCollectionDict[linkCollection.linkCollectionId].links.map((link: PostLinkCollectionRequestLink, index: number) => (
                                    <Grid item xs={12} key={index}>
                                      <input
                                        type="text"
                                        placeholder="リンク"
                                        name="url"
                                        value={link.url}
                                        onChange={(e) => handleLinkCollectionDictUrlChange(e, linkCollection.linkCollectionId, index)}
                                      />
                                      <input
                                        type="text"
                                        placeholder="コメント"
                                        name="description"
                                        value={link.description}
                                        onChange={(e) => handleLinkCollectionDictDescriptionChange(e, linkCollection.linkCollectionId, index)}
                                      />
                                      <button onClick={() => handleDeleteLinkCollectionDictLinkForm(linkCollection.linkCollectionId, index)}>-</button>
                                    </Grid>
                                  ))}
                                  <Button onClick={() => handleCreateLinkCollectionDictLinkForm(linkCollection.linkCollectionId)}>リンク集を追加</Button>
                                  <Button
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                    onClick={() => {toggleEditState(linkCollection.linkCollectionId, false)}}
                                  >
                                    編集をやめる
                                  </Button>
                                  <Button onClick={() => handleUpdateLinkCollection(linkCollection.linkCollectionId)}>保存</Button>
                                </>
                              ) : (
                                linkCollection.links.map((link: any) => {
                                  return (
                                    <>
                                      <OgpLinkCard
                                        link={link}
                                      />
                                      <p>LinkId: {link.linkId}</p>
                                      <p>{link.description}</p>
                                    </>
                                  );
                                })
                              )
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