import { memo, useState } from "react";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsFillPersonFill,
} from "react-icons/bs";
import { GrSearch } from "react-icons/gr";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { formatter } from "utils/formatter";
import Brand from "components/brand";
import Purpose from "components/purpose";
import { ROUTERS } from "utils/router";

const LaptopPage = () => {

  return (
    <>
    <Brand />
    <Purpose />
    </>
  );
};

export default memo(LaptopPage);