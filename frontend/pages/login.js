import React, { useState } from "react";
import Image from "next/image";
import { Row, Col, Form, Input, Button, Carousel } from "antd";
import { primary_color } from "../utils/constants";
import { connect } from "react-redux";
import { authLogin } from "../store/index";
import Router from "next/router";
import useWindowSize from "../utils/windowsSize";

function Login({ userData, authLogin }) {
  const { width } = useWindowSize();
  if (userData.token) {
    Router.replace("/dashboard");
  }

  const onFinish = (data) => {
    authLogin({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <div
      style={
        {
          // height: "100vh",
          // width: "100 vw",
          // backgroundColor: primary_color,
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
        }
      }
    >
      <Row
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: primary_color,
        }}
        // background:
        align="middle"
        justify="center"
      >
        <Col
          // span={12}
          xs={0}
          sm={0}
          md={0}
          lg={12}
          xl={12}
          xxl={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "50vw",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              style={{
                height: "auto",
                width: "100%",
                // maxWidth: "700px",
                textAlign: "center",
              }}
              src="/land-02-bg.png"
              alt=""
            />

            <h1 style={{color:'white'}}>Manage everything from here!</h1>
          </div>
        </Col>
      

    

        <Col
          // span={12}
          xs={24}
          sm={24}
          md={24}
          lg={12}
          xl={12}
          xxl={12}
          style={{
            height: "100vh",
            // width: "50vw",

            backgroundColor: "white",
          }}
        >
          <div
            style={{
              height: "90%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Image
              src="/gumaatalogo-Colored.png"
              alt=""
              style={{ height: "100%", maxHeight: "120px", width: "auto" }}
            /> */}
            <h1
              style={{
                margin: "30px 0px",
                color: primary_color,
                marginBottom: 0,
              }}
            >
              Welcome
            </h1>
            <p>Login to access personal and system informations.</p>{" "}
            <Form
              // name="basic"
              style={{ margin: "10px 0px", width: "300px" }}
              // autoComplete="off"
              // wrapperCol={{
              //   span: 18,
              // }}
              labelCol={{ span: 6 }}
              requiredMark={false}
              onFinish={onFinish}
            >
              <Form.Item
                style={{ margin: "20px 0px" }}
                name="username"
                // label="Phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input
                  style={{ borderRadius: 6, borderColor: "#bbb" }}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                style={{ margin: "20px 0px" }}
                name="password"
                // label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  style={{ borderRadius: 6, borderColor: "#bbb" }}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item style={{ margin: "40px 0px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{ borderRadius: 6, padding: "5px 35px" }}
                  loading={userData.loading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

// export default Login
const mapStateToProps = (state) => {
  return {
    userData: state.auth_reducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authLogin: (value) => dispatch(authLogin(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
