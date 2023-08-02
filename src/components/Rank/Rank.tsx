import React from "react";

type RankProps = {
    name: string,
    entries: number
}
const Rank: React.FC<RankProps> = ({name, entries}) => {
    return (
        <div>
            <div className={'white f3'}>{`${name}, your current entry count is...`}</div>
            <div className={'white f3'}>{entries}</div>
        </div>
    )
}

export default Rank
