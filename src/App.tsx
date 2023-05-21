import React, { useState, useEffect, createContext } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { hot } from "react-hot-loader/root";

import CommonLayout from "components/layouts/CommonLayout"
import Home from "components/pages/Home"
import SignUp from "components/pages/SignUp"
import SignIn from "components/pages/SignIn"
import Themes from "components/pages/Themes"
import Theme from "components/pages/Theme"
import UserName from "components/pages/UserName"

import { getCurrentUser } from "lib/api/auth"
import { User } from "interfaces/user"
import { execTest } from "lib/api/test"

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

  const handleExecTest = async () => {
    const res = await execTest()

    if (res.status === 200) {
      setMessage(res.data.message)
    }
  }

  useEffect(() => {
    handleExecTest()
  }, [])

  // 認証済みのユーザーがいるかどうかチェック
  // 確認できた場合はそのユーザーの情報を取得
  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser()
      console.log(res)

      if (res?.status === 200) {
        setIsSignedIn(true)
        setCurrentUser(res?.data.currentUser)
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
            
            <Route path="/themes" element={<Themes />} />
            {/* <Route path="/home" element={<Home />} /> */}
            <Route path="/:user_name" element={<UserName />} />
            <Route path="/:user_name/themes/:theme_id" element={<Theme />} />
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
