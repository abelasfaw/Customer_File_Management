import React from "react";
import WithAuth from "../utils/protectRoute";
import { primary_color } from "../utils/constants";
import DemoLine from "../Components/Dashboard/multi-line-plotgraph";
import { Row, Col, Card, Select, Progress, Space, Table, Button } from "antd";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
const DataCard = ({ icon, text, value }) => (
  <>
    <Col span={8}>
      <Card
        style={{
          // backgroundColor: "rgba(126, 121, 0, 0.5)",
          // backgroundImage:
          //   "linear-gradient(to bottom right, rgba(16, 142, 233,0.1), rgba(135, 208, 104,0.4))",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(3.5px)",
          boxShadow: " 0 4px 30px rgba(0, 0, 0, 0.1)",
          padding: "10px",
          maxWidth: "300px",
        }}
      >
        <Row justify="space-around">
          {icon}
          <div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: primary_color,
              }}
            >
              {value}
            </div>
            <div style={{ color: primary_color }}>{text}</div>
          </div>
        </Row>
      </Card>
    </Col>
  </>
);

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
  },
  {
    key: "3",
    name: "Bruno",
    age: 28,
    address: "10 Downing Street",
  },
  {
    key: "2",
    name: "Fred",
    age: 30,
    address: "10 Downing Street",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];
function dashboard() {
  return (
    <div>
      <Row
        gutter={16}
        style={{
          margin: "20px 0px",
        }}
      >
        <Col span={16}>
          <Row gutter={16}>
            <DataCard
              icon={
                <MonetizationOnIcon
                  style={{ fontSize: "48px", color: primary_color }}
                />
              }
              value="94,000"
              text="Revenue"
            />
            <DataCard
              icon={
                <PeopleAltIcon
                  style={{ fontSize: "48px", color: primary_color }}
                />
              }
              value="1278"
              text="Customers"
            />
            <DataCard
              icon={
                <MonetizationOnIcon
                  style={{ fontSize: "48px", color: primary_color }}
                />
              }
              value="94,000"
              text="Revenue"
            />
          </Row>
          <Card
            style={{ marginTop: "20px" }}
            title="Data Title"
            extra={
              <Select
                defaultValue="year"
                options={[
                  {
                    value: "year",
                    label: "This Year",
                  },
                  {
                    value: "week",
                    label: "This Week",
                  },
                  {
                    value: "day",
                    label: "Today",
                  },
                ]}
              />
            }
          >
            <DemoLine />
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="Progress"
            extra={
              <Select
                defaultValue="day"
                options={[
                  {
                    value: "year",
                    label: "This Year",
                  },
                  {
                    value: "week",
                    label: "This Week",
                  },
                  {
                    value: "day",
                    label: "Today",
                  },
                ]}
              />
            }
          >
            <Row justify="space-around">
              <Space direction="vertical">
                <h1>Training Progress</h1>
                <Progress
                  type="circle"
                  percent={68}
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                  strokeWidth={12}
                />
              </Space>
              <Space direction="vertical">
                <h1>Other Progress</h1>

                <Progress
                  type="circle"
                  percent={83}
                  strokeColor={{
                    "0%": "#FF990C",
                    "100%": "#FE365E",
                  }}
                  strokeWidth={12}
                />
              </Space>
            </Row>
          </Card>

          <Card style={{ marginTop: "20px" }}>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{
                responsive: true,
                hideOnSinglePage: true,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default WithAuth(dashboard);
