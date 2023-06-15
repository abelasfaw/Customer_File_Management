import React, { useEffect } from "react";
import { Form, Button, Input } from "antd";

function Addcustomer({ onSubmit, onCancel, loading, isEditing, customerData }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditing) {
      console.log(customerData);
      form.setFieldValue({
        ...customerData,
      });
    }
  }, []);

  return (
    <div>
      <Form
        form={form}
        initialValues={{ firstName: customerData["firstName"] }}
        labelCol={{ span: 24 }}
        onFinish={(e) => {
          onSubmit(e);
        }}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            {
              required: true,
              message: "Please input your first name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="middleName"
          label="Middle Name"
          rules={[
            {
              required: true,
              message: "Please input your middle name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            {
              required: true,
              message: "Please input your last name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            {
              required: true,
              message: "Please input your phone number!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="registrationNumber"
          label="Registration Number"
          rules={[
            {
              required: true,
              message: "Please input your registration number!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button loading={loading} type="primary" htmlType="submit">
              Add Customer
            </Button>
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => {
                onCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Addcustomer;
