import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import LoadingComponent from "../Components/loadingComponent";
import { updateProfile, getProfile, changePassword } from "../store";
import WithAuth from "../utils/protectRoute";
import {
  Row,
  Col,
  Divider,
  Form,
  Input,
  Typography,
  Button,
  Modal,
} from "antd";

function Profile(props) {
  const [visible, setvisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    props.getProfile();
  }, []);

  if (Object.keys(props.data).length > 0) {
    form.setFieldsValue({
      firstName: props.data.firstName,
      lastName: props.data.lastName,
      username: props.data.username,
    });
  }

  const onFinish = (e) => {
    props.changePassword(e);
  };

  return (
    <div>
      {props.loading ? (
        <LoadingComponent />
      ) : (
        <>
          <Typography.Title level={3}>Update My Profile</Typography.Title>
          <Divider />
          <Row>
            <Col sm={20} xs={20} md={14} lg={12} l={12} span={12}>
              <Form
                form={form}
                labelCol={{ span: 5 }}
                onFinish={(e) => {
                  props.updateProfile(e);
                }}
              >
                <Form.Item name="firstName" label="First Name">
                  <Input placeholder="First Name" />
                </Form.Item>
                <Form.Item name="lastName" label="Last Name">
                  <Input placeholder="Last Name" />
                </Form.Item>
                <Form.Item name="username" label="Username">
                  <Input placeholder="Username" />
                </Form.Item>

                <Form.Item style={{ textAlign: "end" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={props.loading}
                  >
                    Save Changes
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col offset={3} sm={20} xs={20} md={8} lg={8} l={8} span={8}>
              <Button
                type="primary"
                ghost
                onClick={() => {
                  setvisible(true);
                }}
              >
                Change Password
              </Button>
            </Col>
          </Row>
        </>
      )}
      <Modal
        open={visible}
        footer={null}
        destroyOnClose
        title="Change password"
        onCancel={() => {
          setvisible(false);
        }}
      >
        <Form onFinish={onFinish}>
          <Form.Item name="oldPassword">
            <Input.Password placeholder="Old Password" />
          </Form.Item>
          <Form.Item name="newPassword">
            <Input.Password placeholder="New Password" />
          </Form.Item>
          <Form.Item style={{ textAlign: "end" }}>
            <Button type="primary" htmlType="submit" loading={props.loading}>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    data: state.profile_reducer.data,
    loading: state.profile_reducer.loading,
    error: state.profile_reducer.error,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: (formData) => dispatch(updateProfile(formData)),
    getProfile: () => dispatch(getProfile()),
    changePassword: (formData) => dispatch(changePassword(formData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuth(Profile));
