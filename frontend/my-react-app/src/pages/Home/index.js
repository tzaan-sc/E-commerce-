import {memo} from "react"
import HotProduct from "components/widgets/hotproduct";
import SuggestedProduct from "components/widgets/suggestedproduct";
import Banner from "components/widgets/banner";

const HomePage = () =>{
    return (
    <>
    <Banner/>
    <HotProduct />
   
    </>
    );
};
export default memo(HomePage);
