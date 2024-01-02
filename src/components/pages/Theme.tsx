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

// テーマ詳細ページ
const Theme: React.FC = () => {
  const { currentUser } = useContext(AuthContext)
  const { theme_id } = useParams<{ theme_id: string }>()
  const parsedId = parseInt(theme_id as string, 10)

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
  const [loading, setLoading] = useState<boolean>(true)

  // テーマ編集
  const [title, setTitle] = useState<string>("")
  const [updateTitle, setUpdateTitle] = useState<string>("")
  const [postStatus, setPostStatus] = useState<string>("Private")
  const [updatePostStatus, setUpdatePostStatus] = useState<string>("Private")
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)

  // タグ編集
  const [tags, setTags] = useState<string[]>([]);
  const [updateTags, setUpdateTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [isEditingTags, setIsEditingTags] = useState<boolean>(false)

  // 新規リンク集追加
  const [newSubtitle, setNewSubtitle] = useState<string>("")
  const [newLinks, setNewLinks] = useState<PostLinkCollectionRequestLink[]>([])
  
  // リンク集編集
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentLinkCollectionId, setCurrentLinkCollectionId] = useState(-1); // 現在選択されているlinkCollectionIdを追跡
  const [linkCollectionEditStates, setLinkCollectionEditStates] = useState(() => {
    const editStateDict: { [key: number]: boolean } = {};
    theme.linkCollections?.forEach((linkCollection: any) => {
      editStateDict[linkCollection.linkCollectionId] = false; // 初期値として false（非編集状態）を設定
    });
    return editStateDict;
  });
  const [updateLinkCollectionDict, setUpdateLinkCollectionDict] = useState<{ [key: number]: PostLinkCollectionRequest }>({});

  // その他変数
  const updateThemeTitle = 1
  const updateThemeTags = 2
  const postStatusOptions: string[] = ['Private', 'Limited', 'Public']

  const navigate = useNavigate()

  useEffect(() => {
    handleGetTheme()
  }, [])



  // テーマ編集

  // タイトルをクリックした時にタイトル・公開範囲を編集状態にする
  // isEditingの値によって編集するか編集解除するかを決める
  const handleEditTitle = (isEditing: boolean) => {
    if(currentUser == undefined) return
    if(theme.user.userId != currentUser.id) return
    setIsEditingTitle(isEditing)
    setUpdateTitle(title);
    setUpdatePostStatus(postStatus);
  }

  // テーマのタイトルを入力に応じて更新する
  const handleThemeTitleChange = (e: any) => {
    setUpdateTitle(e.target.value)
  }

  // テーマの投稿状態を入力状態に応じて更新する
  const handlePostStatusChange = (e: any) => {
    setUpdatePostStatus(e.target.value)
  }



  // タグ機能

  // クリックした時にタグを編集状態にする
  // isEditingの値によって編集するか編集解除するかを決める
  const handleEditTags = (isEditing: boolean) => {
    if(currentUser == undefined) return
    if(theme.user.userId != currentUser.id) return
    setIsEditingTags(isEditing)
    setNewTag("");
    setUpdateTags([...tags])
  }

  // タグ追加時に入力に応じて値を変更する
  const handleNewTagChange = (e: any) => {
    setNewTag(e.target.value);
  }

  // タグを追加する
  const handleAddNewTag = () => {
    if(newTag == "") return; // 空欄の場合return
    if (updateTags.includes(newTag)) { // 既に同じタグがある場合return
      setNewTag("");
      return;
    }
    setUpdateTags([...updateTags, newTag]);
    setNewTag("");
  };

  // タグを削除する
  const handleDeleteTag = (tag: string) => {
    const filteredUpdateTags = updateTags.filter(word => word !== tag);
    setUpdateTags(filteredUpdateTags)
  };



  // リンク集追加

  // リンク集のサブタイトル追加
  const handleLinkCollectionSubtitleChange = (e: any) => {
    setNewSubtitle(e.target.value)
  }

  // リンクフォームのURL追加
  const handleLinkUrlChange = (e: any, index: number) => {
    const updateLinks = [...newLinks]
    updateLinks[index].url = e.target.value
    setNewLinks(updateLinks)
  }

  // リンクフォームのdescription修正
  const handleLinkDescriptionChange = (e: any, index: number) => {
    const updateLinks = [...newLinks]
    updateLinks[index].description = e.target.value
    setNewLinks(updateLinks)
  }

  // リンクフォーム追加
  const handleCreateLinkForm = () => {
    setNewLinks([...newLinks, { url: "", description: "" }])
  }

  // リンクフォーム削除
  const handleDeleteLinkForm = (index: number) => {
    const updateLinks = [...newLinks]
    updateLinks.splice(index, 1)
    setNewLinks(updateLinks)
  }



  // リンク集修正

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
  // linkCollectionIdに該当するリンク集を編集するか決める
  const toggleEditState = (linkCollectionId: number, flag: boolean) => {
    setLinkCollectionEditStates(prevEditStates => ({
      ...prevEditStates,
      [linkCollectionId]: flag
    }));
    if (flag) {
      var tmpSubtitle = ""
      var tmpLinks: any[] = []
      
      theme.linkCollections?.forEach((linkCollection: any) => {
        if (linkCollection.linkCollectionId == linkCollectionId) {
          tmpSubtitle = linkCollection.subtitle
          tmpLinks = linkCollection.links
        }
      });
      
      // updateLinkCollectionDictに追加
      setUpdateLinkCollectionDict(prevUpdateLinkCollectionDict => ({
        ...prevUpdateLinkCollectionDict,
        [linkCollectionId]: {
          subtitle: tmpSubtitle,
          links: tmpLinks
        }
      }));
    }else {
      // updateLinkCollectionDictを削除
      setUpdateLinkCollectionDict(prevUpdateLinkCollectionDict => {
        const newUpdateLinkCollectionDict = { ...prevUpdateLinkCollectionDict };
        delete newUpdateLinkCollectionDict[linkCollectionId];
        return newUpdateLinkCollectionDict;
      });
    }
  };

  // 既にあるリンク集のサブタイトル編集
  const handleLinkCollectionDictSubtitleChange = (e: any, id: number) => {
    setUpdateLinkCollectionDict(prevUpdateLinkCollectionDict => ({
      ...prevUpdateLinkCollectionDict,
      [id]: {
        subtitle: e.target.value,
        links: updateLinkCollectionDict[id].links
      }
    }));
  };

  // 既にあるリンク集のURL編集
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

  // 既にあるリンク集のdescription編集
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

  // 既にあるリンク集にリンクフォームを追加
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

  // 既にあるリンク集のリンクフォームを削除
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

  // サーバーからのデータに特定のリンク集がなければ、それを辞書から削除
  const updateEditStates = () => {
    const linkCollectionIds = theme.linkCollections?.map(lc => lc.linkCollectionId.toString()) || [];
  
    setLinkCollectionEditStates((prevEditStates) => {
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



  // テーマの詳細情報を取得
  const handleGetTheme = async () => {
    try {
      const res = await getTheme(parsedId)
      console.log(res)

      if (res?.status === 200) {
        setTheme(res?.data.theme)
        setTitle(res?.data.theme.title)
        setPostStatus(postStatusOptions[res?.data.theme.postStatus])
        setTags(res?.data.theme.tags)
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
  const handleUpdateTheme = async (themeUpdateStatus: number) => {
    const data: PutThemeRequest = {
      title: title,
      postStatus: postStatusOptions.indexOf(postStatus),
      tagList: tags
    }

    if(themeUpdateStatus == updateThemeTitle) {
      data.title = updateTitle
      data.postStatus = postStatusOptions.indexOf(updatePostStatus)
    }else if(themeUpdateStatus == updateThemeTags) {
      data.tagList = updateTags
    }

    try {
      const res = await putTheme(parsedId, data)
      console.log(res)

      if (res?.status === 200) {
        console.log("Updated")
        if(themeUpdateStatus == updateThemeTitle) {
          setTitle(updateTitle)
          setPostStatus(updatePostStatus)
          setIsEditingTitle(false)
        }else if(themeUpdateStatus == updateThemeTags) {
          setTags(updateTags)
          setIsEditingTags(false)
        }
      } else {
        console.log("No themes")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
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
      subtitle: newSubtitle,
      links: newLinks
    }

    try {
      const res = await postLinkCollections(parsedId, data)
      console.log(res)

      if (res?.status === 200) {
        console.log("OK")
        handleGetTheme()
        setNewSubtitle("")
        setNewLinks([])
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

  return (
    <>
      {
        !loading ? (
          <>
            <Grid container sx={{ width: 960 }}>
              <Grid item xs={12}>
                {isEditingTitle ? (
                  <>
                    <input
                      type="text"
                      value={updateTitle}
                      onChange={handleThemeTitleChange}
                    />
                    <Select
                      value={updatePostStatus}
                      onChange={handlePostStatusChange}
                    >
                      <MenuItem value="Private">Private</MenuItem>
                      <MenuItem value="Limited">Limited</MenuItem>
                      <MenuItem value="Public">Public</MenuItem>
                    </Select>
                    <Button onClick={() => handleEditTitle(false)}>キャンセル</Button>
                    <Button onClick={() => handleUpdateTheme(updateThemeTitle)}>保存</Button>
                  </>
                ) : (
                  <>
                    <h1 onClick={() => handleEditTitle(true)}>{title}</h1>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid container sx={{ width: 960 }}>
              {isEditingTags ? (
                <>
                  {updateTags.map((tag: string) => (
                    <>
                      <h3>{tag}</h3>
                      <Button onClick={() => handleDeleteTag(tag)}>x</Button>
                    </>
                  ))}
                  <input
                    type="text"
                    placeholder="新規タグ"
                    name="url"
                    value={newTag}
                    onChange={handleNewTagChange}
                  />
                  <Button onClick={handleAddNewTag}>タグ保存</Button>
                  <Button onClick={() => handleEditTags(false)}>キャンセル</Button>
                  <Button onClick={() => handleUpdateTheme(updateThemeTags)}>保存</Button>
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    {tags.map((tag: string) => (
                      <>
                        <h3>{tag}</h3>
                      </>
                    ))}
                  </Grid>
                  <Button onClick={() => handleEditTags(true)}>タグを編集</Button>
                </>
              )}
            </Grid>
            <Grid container>
              {
                currentUser && currentUser.id == theme.user.userId ? (
                  <>
                    <input
                      type="text"
                      placeholder="サブタイトル"
                      name="subtitle"
                      value={newSubtitle}
                      onChange={(e) => handleLinkCollectionSubtitleChange(e)}
                    />
                    <Button onClick={handleDestroyTheme}>テーマを削除</Button>
                    {newLinks.map((link: PostLinkCollectionRequestLink, index: number) => (
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
                              linkCollectionEditStates[linkCollection.linkCollectionId] ? (
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

export default Theme