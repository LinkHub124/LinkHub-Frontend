import React, { useState, useEffect, useContext } from "react"

import { makeStyles } from "@material-ui/core/styles"
import { Grid, Typography } from "@material-ui/core"
import { Card, CardContent, CardHeader } from '@material-ui/core';
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
import { postLinkCollections } from "lib/api/link_collections"
import { GetThemeResponse } from "interfaces/theme"
import { PostLinkCollectionRequest, PostLinkCollectionRequestLink } from "interfaces/link_collection"

import { AuthContext } from "App"

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

  // テーマの詳細情報を取得
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
      } else {
        console.log("Failed")
      }

    } catch (err) {
      console.log(err)
    }
  }



  const handleCreateLink = () => {
    setLinks([...links, { url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  };

  const handleLinkChange = (e: any, index: number) => {
    const updatedLinks = [...links];
    updatedLinks[index].url = e.target.value;
    setLinks(updatedLinks);
  };

  useEffect(() => {
    handleGetTheme()
  }, [])

  return (
    <>
      {
        !loading ? (
          <Grid container justify="center" spacing={2}>
            {theme.title}
            <div>
              {links.map((link, index: number) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="テーマのタイトル"
                    name="aaa"
                    value={link.url}
                    onChange={(e) => handleLinkChange(e, index)}
                  />
                  <button onClick={() => handleRemoveLink(index)}>-</button>
                </div>
              ))}
              <button onClick={handleCreateLink}>テーマを追加</button>
              <button onClick={handleCreateLinkCollection}>保存</button>
            </div>
            {
              theme.linkCollections?.map((linkCollection: any, index) => {
                const updatedAtDate = new Date(theme.updatedAt);
                const formattedDate = `${updatedAtDate.getFullYear()}/${(updatedAtDate.getMonth() + 1).toString().padStart(2, '0')}/${updatedAtDate.getDate().toString().padStart(2, '0')} ${updatedAtDate.getHours().toString().padStart(2, '0')}:${updatedAtDate.getMinutes().toString().padStart(2, '0')}`;
                return (
                  <Grid item xs={8} key={index}>
                    <Card>
                      <CardHeader
                        title={
                          <Typography variant="body1" component="p" gutterBottom>
                            LinkCollection: {linkCollection.subtitle}
                          </Typography>
                        }
                      />
                      <CardContent>
                        <Typography variant="body2" component="p">
                        {
                          linkCollection.links.map((link: any) => {
                            return (
                              <div>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                  <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '300px' }}>
                                    {link.urlImage && (
                                      <img src={link.urlImage} alt={link.urlTitle} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                                    )}
                                    <h3>{link.urlTitle}</h3>
                                    <p>{link.urlDescription}</p>
                                  </div>
                                </a>
                              </div>
                            );
                          })
                        }
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            }
          </Grid>
        ) : (
          <></>
        )
      }
    </>
  )
}

export default Themes