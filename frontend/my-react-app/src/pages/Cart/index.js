import {memo} from "react"
import ShoppingCart from "components/widgets/shoppingcart";
const CartPage = () => {
  return (
    <div className="cart-page">
      <ShoppingCart />
    </div>
  );
};
export default memo(CartPage);
