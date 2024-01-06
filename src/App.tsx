import React, { useState, useEffect, createContext } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import CommonLayout from "components/layouts/CommonLayout"
import Home from "components/pages/Home"
import SignUp from "components/pages/SignUp"
import SignIn from "components/pages/SignIn"
import Themes from "components/pages/Themes"
import NewTheme from "components/pages/NewTheme"
import Theme from "components/pages/Theme"
import UserName from "components/pages/UserName"
import TagName from "components/pages/TagName"
import Settings from "components/pages/Settings"
import Test from "components/pages/Test"

import { getCurrentUser } from "lib/api/auth"
import { User } from "interfaces/user"

// グローバルで扱う変数・関数
export const AuthContext = createContext({} as {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
})

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()
  const [message, setMessage] = useState<string>("")

  // 認証済みのユーザーがいるかどうかチェック
  // 確認できた場合はそのユーザーの情報を取得
  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser()
      console.log(res)

      if (res?.status === 200) {
        setIsSignedIn(true)
        setCurrentUser(res?.data.currentUser)
        console.log("handleGetCurrentUser")
      } else {
        console.log("No current user")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    handleGetCurrentUser()
    console.log("handleGetCurrentUser")
  }, [setCurrentUser])


  // ユーザーが認証済みかどうかでルーティングを決定
  // 未認証だった場合は「/signin」ページに促す
  const Private = ({ children }: { children: React.ReactElement }) => {
    if (!loading) {
      if (isSignedIn) {
        return children
      } else {
        return <Navigate to="/sign_in" />
      }
    } else {
      return <></>
    }
  }

  return (
    <Router>
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser}}>
        <CommonLayout>
          <Routes>
            <Route path="/sign_up" element={<SignUp />} />
            <Route path="/sign_in" element={<SignIn />} />
            
            <Route path="/" element={<Themes />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/home" element={<Home />} />
            <Route path="/testtest" element={<Test />} />
            <Route path="/:user_name" element={<UserName />} />
            <Route path="/themes/new" element={<NewTheme />} />
            <Route path="/themes/:theme_id" element={<Theme />} />
            <Route path="/tags/:tag_name" element={<TagName />} />
            {/* <Route
              path="*"
              element={
                <Private>
                  <Routes> */}
                    
                    
                    {/* <Route path="/chat_rooms" element={<ChatRooms />} />
                    <Route path="/chatroom/:id" element={<ChatRoom />} />
                    <Route path="*" element={<NotFound />} /> */}
                  {/* </Routes>
                </Private>
              }
            /> */}
          </Routes>
        </CommonLayout>
      </AuthContext.Provider>
    </Router>
  )
}

export default App
