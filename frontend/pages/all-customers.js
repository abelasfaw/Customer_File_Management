import React, { useState, useEffect } from "react";
import WithAuth from "../utils/protectRoute";
import UserForm from "../Components/UserManagmentComponents/userForm";
import { error_color, success_color } from "../utils/constants";
import { connect } from "react-redux";
import { Button, Col, Input, Modal, Row, Table } from "antd";
import { fetchallcustomerSuccess } from "../store";

const columns = [
  {
    title: "Name",
    key: "name",
    render: (text, record) => (
      <>{record.firstName + " " + record.middleName + " " + record.lastName}</>
    ),
  },
  {
    title: "Phone Number",
    key: "phoneNumber",
    render: (text, record) => <>+251-{record.phoneNumber}</>,
  },
  {
    title: "Registration Number",
    key: "office",
    render: (text, record) => <>{record.registrationNumber}</>,
  },

];

function Customers(props) {
  const [current, setCurrent] = useState(1);
  const [visible, setvisible] = useState(false);

  let numEachPage = 10;
  useEffect(() => {
    props.fetchallcustomerSuccess(1, numEachPage);
  }, []);

  const onFinish = (data) => {
    props.userCreate(data);
  };


  console.log(props.customers);

  const handleChange = (pageNumber, size) => {
    numEachPage = size;
    setCurrent(pageNumber);
    props.fetchallcustomerSuccess(pageNumber, numEachPage);
  };

  return (
    <>
      <Row>
        <Col span={22}>
          <Row justify="space-between" align="middle">
            <h2>Manage Customers</h2>
          
          </Row>
          <Table
            dataSource={props.customers}
            loading={props.loading}
            columns={columns}
            title={() => (
              <Row
                justify="space-between"
                align="middle"
                style={{ margin: "0px 25px" }}
              >
                <div style={{ fontSize: 17, fontWeight: 600 }}>Customers List</div>
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
        onCancel={() => {
          setvisible(false);
        }}
        footer={null}
      >
        <UserForm onFinish={onFinish} />
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    customers: state.allcustomersreducer.all_customers,
    loading: state.allcustomersreducer.loading,
    error: state.allcustomersreducer.error,
    count: state.allcustomersreducer.count,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchallcustomerSuccess: (page, limit) =>
      dispatch(fetchallcustomerSuccess(page, limit)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuth(Customers));
