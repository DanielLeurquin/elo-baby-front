import React, {FC, useEffect} from "react";
import Header from "../header/header";
import MobileNav from "../mobileNav/mobileNav";
import { getTokenFromRefreshToken, getTokenSubject } from "../../service/token.service";
import { useNavigate } from "react-router-dom";
import getUserSubject, { getActiveUser } from "../../service/user.Service";

type LayoutProps = {
    children: React.ReactNode;
  };

  const Layout: FC<LayoutProps> = ({ children }) => {

    const navigate = useNavigate();

  const refreshToken = localStorage.getItem("refreshToken");
  
  useEffect(() => {
    if(!refreshToken) {
      navigate("/login");
      return;
    }
    
    try {
        getTokenFromRefreshToken({"refreshToken" : refreshToken});
    } catch (error) {
        console.error("Login failed:", error);
        navigate("/login");
    }

    getTokenSubject().subscribe(async () => {
        try {
          
          if(getUserSubject().value === null) {
            await getActiveUser();
          }
          
        } catch (error) {
          console.error("Unable to get active user", error);
        }
      });
      
    
  }, []);
  
    return (
    <div className="h-full">
        <div className="block maxSm:hidden">
            <Header />
        </div>
        {children}
        <div className="hidden maxSm:block">
            <MobileNav />
        </div>
    </div>
      
    );
  };
  
  export default Layout;