
import {memo} from "react"
// ⚠️ PHẢI IMPORT OUTLET
import { Outlet } from 'react-router-dom'; // 👈 IMPORT NÀY
import Header from "../header";
import Footer from "pages/user/footer";


// Bỏ prop {children, ...props}
const CustomerLayout = () =>{
    return (
        <div>
            <Header />
           
            <main className="customer-home">
                 <Outlet /> 
            </main>
            
            <Footer />
        </div>
    );
};
export default memo(CustomerLayout);