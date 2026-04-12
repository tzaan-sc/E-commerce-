// import {memo} from "react"
// import HomePage from "../../homePage";
// import Header from "../header";
// import Footer from "../footer";


// const MainLayout = ({children, ...props}) =>{
//     return (
//     <div>
//     <Header /> 

//     {children} 
    
//     <Footer />
//     </div>
//     );
// };
// export default memo(MainLayout);

import {memo} from "react"
// ⚠️ PHẢI IMPORT OUTLET
import { Outlet } from 'react-router-dom'; // 👈 IMPORT NÀY
import Header from "../Header";
import Footer from "../Footer";
// import Chatbot from "../../../components/common/Chatbot";


// Bỏ prop {children, ...props}
const MainLayout = () =>{
    return (
        <div>
            <Header /> 

            {/* 👈 THAY THẾ {children} BẰNG <Outlet /> */}
            <main className="main-content">
                 <Outlet /> 
            </main>
            
            <Footer />
            {/* <Chatbot /> */}
        </div>
    );
};
export default memo(MainLayout);
