import React, { useEffect, useState } from "react";
import WithAuth from "../utils/protectRoute";
import { useRouter } from "next/router";
import OfficeUsers from "../Components/forwardAccessUsers/offiiceUsers"
import { connect } from "react-redux";
import {
  getAllpermitedSuccess,
  deleteExpiredFileAccesses,
  getOfficePeople,
  forwardFileAccess,
} from "./../store";
import { Row, Col, Space, Button, Table, Modal } from "antd";
import moment from "moment";

function checktime(str) {
  return moment.utc(moment.now()).diff(moment(str), "minutes");
}

function PermitedAccess(props) {
  const [current, setCurrent] = useState(1);
  const [visible, setVisible] = useState(false);
  const [fileAccessId, setFileAccessId] = useState(null);


  const [filteredData, setFilterredData] = useState([]);
  const role = localStorage.getItem("type");
  let numEachPage = 10;
  const router = useRouter();
  let expiredAccesses = [];



  useEffect(() => {
    props.getAllpermitedSuccess();
  }, []);

  useEffect(() => {
    if (props.permited.length > 0) {
      let sample_array = [];
      props.permited.forEach((element) => {
        if (checktime(element.createdAt) < 180) {
          element.key = element._id;
          sample_array.push(element);
        } else {
          expiredAccesses.push(element._id);
        }
      });
      setFilterredData(sample_array);
      if (expiredAccesses.length > 0) {
        let formData = { ids: expiredAccesses };
        props.deleteExpiredFileAccesses(formData);
      }
    }
  }, [props.permited]);

  const handleChange = (pageNumber, size) => {
    numEachPage = size;
    setCurrent(pageNumber);
    props.getAllrequestSuccess(filtervalue, pageNumber, numEachPage);
  };

  const onForwardRequest = (user_id)=>{
    props.forwardFileAccess(fileAccessId,user_id,props.permited)
  }

  const columns = [
    {
      title: "Customer Name",
      render: (text, record) => (
        <div>
          <div>
            {record.customer.firstName +
              " " +
              record.customer.middleName +
              " " +
              record.customer.lastName}
          </div>
        </div>
      ),
    },
    {
      title: "Registration Number",
      render: (text, record) => (
        <div>
          <div>{record.customer.registrationNumber}</div>
        </div>
      ),
    },
    {
      title: "Phone Number",
      render: (text, record) => (
        <div>
          <div>{record.customer.phoneNumber}</div>
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "",
      render: (text, record) => (
        <>
          <Space size={20}>
            <Button
              type="primary"
              onClick={() => {
                router.push({
                  pathname: "/customer",
                  query: {
                    token: record.token,
                    customer: record.customer.registrationNumber,
                  },
                });
              }}
            >
              Go To File
            </Button>
            <Button
              type="primary"
              ghost
              onClick={() => {
                setFileAccessId(record._id)
                setVisible(true);
                props.getOfficePeople(role)
              }}
            >
              Forward Access
            </Button>
          </Space>
        </>
      ),
    },
  ];

  return (
    <div>
      <div>
        <h1 style={{ fontSize: 20 }}>Permited Access</h1>
      </div>
      <Row>
        <Col span={18}>
          <Table
            loading={props.loading}
            columns={columns}
            dataSource={filteredData}
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
        open={visible}
        title="Forward Access"
        footer={null}
        onCancel={()=>{setVisible(false)}}
      >
        <OfficeUsers loading={props.loading} users={props.office_users} onClick={(id)=>{onForwardRequest(id)}}/>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    permited: state.allpermitedreducer.permited,
    office_users: state.allpermitedreducer.office_users,
    loading: state.allpermitedreducer.loading,
    error: state.allpermitedreducer.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllpermitedSuccess: (page, limit) =>
      dispatch(getAllpermitedSuccess(page, limit)),
    deleteExpiredFileAccesses: (formData) =>
      dispatch(deleteExpiredFileAccesses(formData)),
    getOfficePeople: (office_type) => dispatch(getOfficePeople(office_type)),
    forwardFileAccess: (file_access_id, user_id, access_list) =>
      dispatch(forwardFileAccess(file_access_id, user_id, access_list)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuth(PermitedAccess));
