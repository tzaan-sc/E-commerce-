import {memo} from "react"
import HotProduct from "components/user/hotproduct";
import SuggestedProduct from "components/user/suggestedproduct";
import Banner from "components/user/banner";

const HomePage = () =>{
    return (
    <>
    <Banner/>
    <HotProduct />
   
    </>
    );
};
export default memo(HomePage);