import React from "react";
import { Menu, Row, Avatar, Col, Popover, Popconfirm, Divider } from "antd";
import Router from "next/router";
import {
  MenuOutlined,
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { primary_color } from "../../utils/constants";
export default function TopicMenu({ items, selectedKey, changeSelectedKey }) {
  const styledTopics = [];
  const userRole = localStorage.getItem("role");
  items.forEach((topic, index) => {
    topic.children !== undefined
      ? styledTopics.push(
          <Menu.SubMenu key={index} icon={topic.icon} title={topic.name}>
            {topic.children.map((e, i) => {
              return (
                <Menu.Item
                  style={{
                    paddingLeft: "5px",
                  }}
                  key={100 + i}
                  l={e.link}
                  onClick={(ev) => {
                    changeSelectedKey(ev, e.link);
                  }}
                >
                  {e.name}{" "}
                </Menu.Item>
              );
            })}
          </Menu.SubMenu>
        )
      : styledTopics.push(
          <Menu.Item
            style={{
              paddingLeft: "5px",
            }}
            key={index}
            l={topic.link}
            onClick={(e) => {
              changeSelectedKey(e);
            }}
            icon={topic.icon}
          >
            {topic.name}{" "}
          </Menu.Item>
        );
  });

  return (
    <>
      <div
        style={{
          height: "120px",
          margin: "12px",
          background: "rgba(56, 255, 255, 0)",
          textAlign: "left",
          marginBottom: "0px",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Row align="middle">
          <span className="avatar-item">
            {
              <Avatar
                shape="circle"
                size="default"
                style={{ backgroundColor: primary_color }}
                icon={<UserOutlined />}
              />
            }
          </span>
          <Col>
            {" "}
            <div
              style={{
                paddingLeft: "10px",
                paddingTop: "5px",
                paddingRight: "5px",
                color: primary_color,
                fontSize: 16,
                fontWeight: 600,
                textOverflow: "ellipsis",
              }}
            >
              {localStorage.getItem("name")}
            </div>
            <div
              style={{
                paddingLeft: "10px",
                paddingRight: "5px",
                color: primary_color,
                fontSize: 11,
              }}
            >
              {userRole === "supervisor"
                ? "FSM"
                : userRole === "staff"
                ? "BUM"
                : userRole}
            </div>
          </Col>

          <Popover
            placement="bottomRight"
            content={
              <div>
                <Row
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    Router.push("/profile");
                  }}
                >
                  <UserOutlined
                    style={{ marginRight: "10px", marginTop: "4px" }}
                  />
                  <p>Profile</p>
                </Row>
                <Popconfirm
                  title="Are you sure you want to log out?"
                  onConfirm={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  okText="Logout"
                  cancelText="Cancel"
                >
                  <Row style={{ cursor: "pointer" }}>
                    <LogoutOutlined
                      style={{ marginRight: "10px", marginTop: "4px" }}
                    />
                    <p>Logout</p>
                  </Row>
                </Popconfirm>
              </div>
            }
            trigger="hover"
          >
            <DownOutlined style={{ marginLeft: "8px", color: primary_color }} />
          </Popover>
        </Row>
      </div>
      <Divider style={{ margin: "7px 0px" }} />
      <Menu
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={["0"]}
        theme="light"
        mode="inline"
      >
        {styledTopics}{" "}
      </Menu>
    </>
  );
}
