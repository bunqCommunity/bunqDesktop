import React from "react";

import TargetChip from "./TargetChip";

const styles = {
    chips: {
        margin: 5
    }
};

const TargetChipList = ({ targets, ...restProps }) => {
    return targets.map((target, targetKey) => {
        return <TargetChip key={targetKey} target={target} targetKey={targetKey} {...restProps} />;
    });
};

export default TargetChipList;
