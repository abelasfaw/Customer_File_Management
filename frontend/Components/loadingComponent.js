import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import {primary_color} from "../utils/constants";
function LoadingComponent({minHeight="95vh"}) {
  return (
    <div
      style={{
        minHeight: minHeight,
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {" "}
      <div>
        <LoadingOutlined style={{ fontSize: 80, color: primary_color }} />
      </div>
    </div>
  );
}

export default LoadingComponent;
