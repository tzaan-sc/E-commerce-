import {memo} from "react"
import HomePage from "../../homePage";
import Header from "../header";
import Footer from "../footer";


const MainLayout = ({children, ...props}) =>{
    return (
    <div>
    <Header /> 

    {children} 
    
    <Footer />
    </div>
    );
};
export default memo(MainLayout);