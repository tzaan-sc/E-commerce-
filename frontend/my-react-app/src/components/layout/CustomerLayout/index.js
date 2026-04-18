
import {memo} from "react"
// ⚠️ PHẢI IMPORT OUTLET
import { Outlet } from 'react-router-dom'; // 👈 IMPORT NÀY
import Header from "../Header";
import Footer from "../Footer";
import ChatWidget from "components/user/ChatWiget";



// Bỏ prop {children, ...props}
const CustomerLayout = () =>{
    return (
        <div>
            <Header />
           
            <main className="customer-home">
                 <Outlet /> 
            </main>
             <ChatWidget />
            <Footer />
        </div>
    );
};
export default memo(CustomerLayout);
