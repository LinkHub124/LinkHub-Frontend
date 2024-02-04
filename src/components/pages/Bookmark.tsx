import React, { useState, useEffect, useContext } from "react"

import { makeStyles } from "@mui/material/styles"
import { Grid, Typography, TextField } from "@mui/material"
import { Card, CardContent, CardHeader } from '@mui/material';
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom';
import { BookmarkLink } from 'interfaces/bookmark';
import { useNavigate } from 'react-router-dom'

import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"
import { getBookmarkLinks, deleteBookmarkLink } from 'lib/api/bookmark_links';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';

import AlertMessage from "components/utils/AlertMessage"

import { getUser } from "lib/api/user_name"
import { GetUserResponse } from "interfaces/user"

import { AuthContext } from "App"
import { PostThemeRequest } from "interfaces/theme"
import { postTheme } from "lib/api/themes"

interface ModalProps {
  showModal: boolean;
  setShowModal: any;
  selectedLinks: string[];
}

const Modal: React.FC<ModalProps> = ({ showModal, setShowModal, selectedLinks }) => {
  
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
        navigate(`/themes/${id}`, { state: { selectedLinks } })
      } else {
        console.log("Failed")
      }

    } catch (err) {
      console.log(err)
    }
  }

  const onClose = () => {
    setShowModal(false);
  }
  const { currentUser } = useContext(AuthContext)

  const initialUserState: GetUserResponse = {
    userId: 0,
    name: "test_name"
  }
  const [user, setUser] = useState<GetUserResponse>(initialUserState)

  // ユーザーを取得
  const handleGetUser = async () => {
    try {
    const res = await getUser(currentUser!!.name)

      if (res?.status === 200) {
        setUser(res?.data.user)
      } else {
        console.log("No User")
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    handleGetUser()
  }, [])

  const handleNavigation = (id: number) => {
    navigate(`/themes/${id}`, { state: { selectedLinks } });
  };

  return (
    showModal ? (
      <>
        <div className="modal-backdrop">
          <div className="modal">
            {/* モーダルの内容 */}
            <Button onClick={onClose}>閉じる</Button>
            <Typography variant="h5" component="h1" gutterBottom>
              新規テーマ作成
            </Typography>
            <TextField
              fullWidth
              label="タイトル"
              variant="outlined"
              margin="normal"
              onChange={(e) => setThemeTitle(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleCreateTheme}
            >
              テーマを作成
            </Button>
            <Grid item xs={8}>
              {
                user.themes?.map((theme: any, index: number) => {
                  const updatedAtDate = new Date(theme.updatedAt);
                  const formattedDate = `${updatedAtDate.getFullYear()}/${(updatedAtDate.getMonth() + 1).toString().padStart(2, '0')}/${updatedAtDate.getDate().toString().padStart(2, '0')} ${updatedAtDate.getHours().toString().padStart(2, '0')}:${updatedAtDate.getMinutes().toString().padStart(2, '0')}`;
                  return (
                      <Card className={`status-${theme.postStatus}`}>
                        <CardHeader
                          avatar={<Avatar alt="avatar" src={user.image} />}
                          title={
                            <Typography variant="body2" component="p" gutterBottom>
                              {user.name} {formattedDate}
                            </Typography>
                          }
                        />
                        <CardContent>
                          <Typography variant="body1" component="p">
                            <Button onClick={() => handleNavigation(theme.themeId)}>
                              {theme.title}
                            </Button>
                          </Typography>
                        </CardContent>
                      </Card>
                    
                  );
                })
              }
            </Grid>
          </div>
        </div>
      </>
    ) : (
      <></>
    )
  );
};

// ユーザー一覧ページ
const UserName: React.FC = () => {
  const initialUserState: GetUserResponse = {
    userId: 0,
    name: "test_name"
  }

  const { currentUser } = useContext(AuthContext)

  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<GetUserResponse>(initialUserState)
  const [bookmarkLinks, setBookmarkLinks] = useState<BookmarkLink[]>([]);

  const handleGetBookmark = async () => {
    try {
      // ブックマークを取得
      const res = await getBookmarkLinks();
      console.log(res);

      if (res?.status === 200) {
        setBookmarkLinks(res?.data.bookmarkLinks);
        console.log(res?.data.bookmarkLinks);
      } else {
        console.log('No bookmark data');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetBookmark()
  }, [])

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditing = () => {
    setIsEditing(!isEditing);
  };
  
  const handleDeleteBookmark = async (id: number, link: string) => {

    try {
      // ブックマークを取得
      const res = await deleteBookmarkLink(id);
      console.log(res);
      if (res?.status === 200) {
        handleGetBookmark();
        setSelectedLinks(selectedLinks.filter(i => i !== link));
      } else {
        console.log('No bookmark data');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);

  const handleCheckboxChange = (link: string) => {
    if (selectedLinks.includes(link)) {
      setSelectedLinks(selectedLinks.filter(i => i !== link));
    } else {
      setSelectedLinks([...selectedLinks, link]);
    }
  };

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleExport = () => {
    setShowModal(true);
  };

  return (
    <>
      {
        !loading ? (
          <>
            <Grid container sx={{ width: 960, p: 5 }}>
              <Button onClick={handleEditing}>Edit</Button>
              <Grid item xs={3}>
                <Card>
                  <CardContent>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Avatar variant="rounded" src={currentUser?.image} sx={{ m: 3, width: 100, height: 100 }} />
                      <Typography>{currentUser?.name}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={1}>
                {
                  isEditing ? (
                    <Button onClick={handleExport}>Export</Button>
                  ) : (
                    <></>
                  )
                }
              </Grid>
              <Grid item xs={8}>
                {
                  <List>
                    {bookmarkLinks.map((link, index) => (
                      <ListItem
                        key={index}
                        disablePadding
                        secondaryAction={
                          isEditing ? (
                            <IconButton onClick={() => handleDeleteBookmark(link.bookmarkLinkId, link.url)}edge="end" aria-label="delete">
                              x
                            </IconButton>
                          ) : (
                            <></>
                          )
                        }
                      >
                        {
                          isEditing ? (
                            <input
                              type="checkbox"
                              checked={selectedLinks.includes(link.url)}
                              onChange={() => handleCheckboxChange(link.url)}
                            />
                          ) : (
                            <></>
                          )
                        }
                        <ListItemButton component="a" href={link.url} target="_blank" rel="noopener noreferrer">
                          {
                            <ListItemIcon>
                              <Avatar 
                                sx={{ bgcolor: "white" }} 
                                alt={link.urlTitle}
                                src={link.faviconUrl}
                              />
                            </ListItemIcon>
                          }
                          <ListItemText primary={link.urlTitle} secondary={link.url} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                }
              </Grid>
            </Grid>
            <Modal showModal={showModal} setShowModal={setShowModal} selectedLinks={selectedLinks}/>
          </>
        ) : (
          <></>
        )
      }
    </>
  )
}

export default UserName