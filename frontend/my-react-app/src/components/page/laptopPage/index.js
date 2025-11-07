import { memo, useState } from "react";
import Brand from "components/user/brand";
import Purpose from "components/user/purpose";

const LaptopPage = () => {

  return (
    <>
    <Brand />
    <Purpose />
    </>
  );
};

export default memo(LaptopPage);