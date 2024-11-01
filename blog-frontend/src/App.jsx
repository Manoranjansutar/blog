import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar.component'
import UserAuthForm from './pages/userAuthForm.page'
import { createContext, useEffect, useState } from 'react'
import { lookInSession } from './common/session'
import Editor from './pages/editor.pages'
import scroll from './assets/scroll-up.json';
import Lottie from 'lottie-react'
import Homepage from './pages/home.page'

export const UserContext = createContext({})

const ScrollToTopIcon = ({ onClick }) => (
  <div onClick={onClick} className="fixed z-50 p-3 cursor-pointer bottom-4 right-2 hover:scale-125">
    <div style={{ width: "50px" }}><Lottie animationData={scroll} /></div>
  </div>
);

function App() {
  const [userAuth,setUserAuth] = useState({})
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowIcons(true);
      } else {
        setShowIcons(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(()=>{
    let userInSession = lookInSession("user");
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token:null});
  },[])

  return (
    <UserContext.Provider value={{userAuth,setUserAuth}}>
      {showIcons && (
        <>
          <ScrollToTopIcon onClick={scrollToTop} />
        </>
      )}
       <Routes>
        <Route path='/editor' element={<Editor/>} />
        <Route path='/' element={<Navbar/>}>
         <Route index element={<Homepage/>}/>
         <Route path='signin' element={<UserAuthForm type='sign-in' />} />
         <Route path='signup' element={<UserAuthForm type='sign-up'/>} />
        </Route>
      </Routes>
    </UserContext.Provider>
     
  )
}

export default App
