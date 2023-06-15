import React from "react";
import { Layout } from "antd";
import { primary_color } from "../../utils/constants";
export default function SideBar({ menu, onBreakpoint }) {
  return (
    <Layout.Sider
      style={{
        overflow: "auto",
        height: "100vh",
        // position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        // backgroundColor: primary_color,
      }}
      breakpoint={"lg"}
      theme="light"
      collapsedWidth={0}
      trigger={null}
      onBreakpoint={(broken) => {
        onBreakpoint(broken);
      }}
    >
      {menu}
    </Layout.Sider>
  );
}
