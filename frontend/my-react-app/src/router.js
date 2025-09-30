import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/homePage";
import ProfilePage from "./pages/user/profilePage";
import { ROUTERS } from "./utils/router";
import MainLayout from "./pages/user/theme/mainLayout";

const renderUserRouter = () => {
    const userRouters =[
        {
            path: ROUTERS.USER.HOME,
            component: <HomePage />
        },
        {
            path: ROUTERS.USER.PROFILE,
            component: <ProfilePage />
        },
    ]
    return (
        <MainLayout>
        <Routes>
            {   
                userRouters.map((item, key) => (
                    <Route key={key} path={item.path} element={item.component} />
                    //de trong map de khoi phai viet lai nhieu lan, dung map nay de lap lai thoi
                ))
            }
        </Routes>
        </MainLayout>
    )

}
const RouterCustom = () => {
    return renderUserRouter();
}
export default RouterCustom;