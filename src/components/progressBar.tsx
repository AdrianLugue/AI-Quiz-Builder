import React from "react";

type Props = {
    value: number;
}

const ProgressBar = (props: Props) => {
  return (
    <div className="w-full rounded-full bg-neutral-700 h-2.5">
        <div className="h-2.5 rounded-full bg-secondary" style={{width: `${props.value}%`}}></div>
    </div>
  )
}

export default ProgressBar