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


// デザインテスト
const Test: React.FC = () => {
  return (
    <>
      <Grid container sx={{ backgroundColor: "blue", width: 960 }}>
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
                <Typography>ユーザーネーム</Typography>
                <Typography>ユーザーネーム</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={8}>
          <Card>
            <CardHeader
              title={
                <Typography variant="body1" component="p" gutterBottom>
                  LinkC: subtitle
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="body2" component="p">
              Link
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title={
                <Typography variant="body1" component="p" gutterBottom>
                  LinkC: subtitle
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="body2" component="p">
              Link
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title={
                <Typography variant="body1" component="p" gutterBottom>
                  LinkC: subtitle
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="body2" component="p">
              Link
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container sx={{ backgroundColor: "blue" }}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Typography variant="body1" component="p" gutterBottom>
                  LinkC: subtitle
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="body2" component="p">
              Link
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Test