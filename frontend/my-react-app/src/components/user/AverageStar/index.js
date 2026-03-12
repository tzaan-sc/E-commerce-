import React, { useEffect, useState } from "react";
import { getAverageStar } from "../../../api/reviewApi";

function AverageStar({ productId }) {

    const [avg, setAvg] = useState(0);

    useEffect(() => {
        fetchAvg();
    }, [productId]);

    const fetchAvg = async () => {
        const res = await getAverageStar(productId);
        setAvg(res.data);
    };

    return (
        <h3>{avg ? avg.toFixed(1) : 0} / 5 ⭐</h3>
    );
}

export default AverageStar;