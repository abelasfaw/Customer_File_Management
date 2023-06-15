import React, { useState, useEffect } from "react";
import WithAuth from "../utils/protectRoute";
import UserForm from "../Components/UserManagmentComponents/userForm";

import { error_color, success_color } from "../utils/constants";
import { connect } from "react-redux";
import { Button, Col, Input, Modal, Row, Table } from "antd";
import { usersFetch, userCreate, userActivate, userBlock } from "../store";

let numEachPage = 10;
function Users(props) {
  const [visible, setvisible] = useState(false);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    props.usersFetch(1, numEachPage);
  }, []);

  const onFinish = (data) => {
    props.userCreate(data);
  };

  const handleChange = (pageNumber, size) => {
    numEachPage = size;
    setCurrent(pageNumber);
    props.usersFetch(pageNumber, numEachPage);
  };

  console.log(props.users);

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (text, record) => <>{record.firstName + " " + record.lastName}</>,
    },
    {
      title: "Role",
      key: "role",
      render: (text, record) => <>{record.type}</>,
    },
    {
      title: "Username",
      key: "office",
      render: (text, record) => <>{record.username}</>,
    },

    {
      title: "Status",
      key: "Status",
      render: (text, record) => <>{record.status}</>,
    },

    {
      title: "",
      dataIndex: "activate",
      key: "activate",
      render: (text, record) => {
        return (
          <>
            {" "}
            {record.status === "BLOCKED" ? (
              <Button
                style={{ backgroundColor: success_color, color: "white" }}
                onClick={() => {
                  props.userActivate(record._id, props.users);
                }}
              >
                Activate User
              </Button>
            ) : (
              <Button
                style={{ backgroundColor: error_color, color: "white" }}
                onClick={() => {
                  props.userBlock(record._id, props.users);
                }}
              >
                Block User
              </Button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Row>
        <Col span={22}>
          <Row justify="space-between" align="middle">
            <h2>Manage Users</h2>
            <Button
              type="primary"
              block
              style={{ maxWidth: 250 }}
              onClick={() => {
                setvisible(true);
              }}
            >
              Add User
            </Button>
          </Row>
          <Table
            dataSource={props.users}
            loading={props.loading}
            columns={columns}
            title={() => (
              <Row
                justify="space-between"
                align="middle"
                style={{ margin: "0px 25px" }}
              >
                <div style={{ fontSize: 17, fontWeight: 600 }}>Users List</div>
                <Input.Search placeholder="Search " style={{ maxWidth: 200 }} />
              </Row>
            )}
            pagination={{
              defaultCurrent: 1,
              total: props.count,
              onChange: handleChange,
              defaultPageSize: numEachPage,
              current: current,
              responsive: true,
              hideOnSinglePage: true,
            }}
          />

        </Col>
      </Row>
      <Modal
        title="Add User"
        open={visible}
        destroyOnClose
        onCancel={() => {
          setvisible(false);
        }}
        footer={null}
      >
        <UserForm onFinish={onFinish} loading={props.loading}/>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    users: state.usersreducer.users,
    loading: state.usersreducer.loading,
    error: state.usersreducer.error,
    count: state.usersreducer.count,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    usersFetch: (page, limit) => dispatch(usersFetch(page, limit)),
    userCreate: (formData) => dispatch(userCreate(formData)),
    userActivate: (id, users) => dispatch(userActivate(id, users)),
    userBlock: (id, users) => dispatch(userBlock(id, users)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuth(Users));
