import React, { useEffect } from "react";
import { Button, Divider, Form, Input, Select } from "antd";
import { consumers } from "form-data";
function UserForm({ onFinish, loading,onReset }) {
  const [form] = Form.useForm();


  return (
    <div>
      <Divider />
      <Form onFinish={onFinish} form={form}>
        <Form.Item name="firstName">
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item name="lastName">
          <Input placeholder="Last Name" />
        </Form.Item>
        <Form.Item name="username">
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item name="password">
          <Input placeholder="Password" />
        </Form.Item>
        <Form.Item name="type">
          <Select
            options={[
              {
                label: "ADMIN",
                value: "ADMIN",
              },
              {
                label: "KADASTER",
                value: "KADASTER",
              },
              {
                label: "LAND-OFFICE",
                value: "LAND-OFFICE",
              },
              {
                label: "REVENUE",
                value: "REVENUE",
              },
              {
                label: "CONSTRUCTION",
                value: "CONSTRUCTION",
              },
              {
                label: "FILE-ROOM",
                value: "FILE-ROOM",
              },
            ]}
            placeholder="Office Type"
          />
        </Form.Item>
        <Form.Item style={{ margin: "0px 20px" }}>
          <Button htmlType="submit" type="primary" block loading={loading}>
            Create User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserForm;
