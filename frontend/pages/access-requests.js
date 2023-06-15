import React, { useEffect,useState } from "react";
import WithAuth from "../utils/protectRoute";
import { primary_color } from "../utils/constants";
import { Table, Popover, Space, Button, Col, Row, Card, Select } from "antd";
import { connect } from "react-redux";
import {
  getAllrequestSuccess,
  requestCreate,
  acceptORdenyrequest,
} from "../store";
import BadgeIcon from "@mui/icons-material/Badge";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import Person3Icon from "@mui/icons-material/Person3";
import PinIcon from "@mui/icons-material/Pin";
import PhoneIcon from "@mui/icons-material/Phone";

const SingleHoverElement = ({ icon, title, value }) => {
  return (
    <div>
      {" "}
      <Space align="start" size={4}>
        <Space align="start" size={1}>
          {icon}
          <div style={{ fontSize: 16, fontWeight: 500 }}>
            <span style={{ color: primary_color }}>
              {title}: {"  "}
            </span>
          </div>
        </Space>{" "}
        <span style={{ fontSize: 16, fontWeight: 400 }}>
          {"  "}
          {value}
        </span>
      </Space>
    </div>
  );
};



function AccessRequests(props) {
  const [current, setCurrent] = useState(1);
  const [filtervalue, setFiltervalue] = useState("PENDING");

  let numEachPage=10
  const columns = [
    {
      title: "Requested from",
      dataIndex: "office_name",
      render: (text, record) => (
        <div style={{ cursor: "pointer" }}>
          <Popover
            title="Requested from"
            trigger="hover"
            placement="bottomRight"
            content={
              <div>
                <SingleHoverElement
                  icon={<BadgeIcon style={{ color: primary_color }} />}
                  title="Office Name"
                  value={record.requested_by.type}
                />

                <SingleHoverElement
                  icon={<LiveHelpIcon style={{ color: primary_color }} />}
                  title="Requested By"
                  value={
                    record.requested_by.firstName +
                    " " +
                    record.requested_by.lastName
                  }
                />
                {/* <SingleHoverElement
                icon={<AccessTimeFilledIcon style={{ color: primary_color }} />}
                title="Request Time"
                value={record.request_time}
              /> */}
              </div>
            }
          >
            <div>{record.requested_by.type}</div>
          </Popover>
        </div>
      ),
    },
    {
      title: "Customer details",
      dataIndex: "customer_name",
      render: (text, record) => (
        <div style={{ cursor: "pointer" }}>
          <Popover
            title="Customer Details"
            trigger="hover"
            placement="bottomRight"
            content={
              <div>
                <SingleHoverElement
                  icon={<Person3Icon style={{ color: primary_color }} />}
                  title="Customer Name"
                  value={
                    record.customer.firstName +
                    " " +
                    record.customer.middleName +
                    " " +
                    record.customer.lastName
                  }
                />
                <SingleHoverElement
                  icon={<PinIcon style={{ color: primary_color }} />}
                  title="Customer Number"
                  value={record.customer.registrationNumber}
                />
                <SingleHoverElement
                  icon={<PhoneIcon style={{ color: primary_color }} />}
                  title="Customer Phone"
                  value={record.customer.phoneNumber}
                />
              </div>
            }
          >
            <div>{record.customer.registrationNumber}</div>
          </Popover>
        </div>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => <>{record.status}</>,
    },
    {
      title: "",
      dataIndex: "",
      render: (text, record) => (
        <>
          {record.status == "PENDING" ? (
            <Space size={20}>
              <Button
                type="primary"
                onClick={() => {
                  props.acceptORdenyrequest(
                    record._id,
                    "accept",
                    props.requests
                  );
                }}
              >
                Accept
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => {
                  props.acceptORdenyrequest(record._id, "deny", props.requests);
                }}
              >
                Deny
              </Button>
            </Space>
          ) : (
            <></>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    props.getAllrequestSuccess(filtervalue,1,numEachPage);
  }, []);

  
  const handleChange = (pageNumber, size) => {
    numEachPage = size;
    setCurrent(pageNumber);
    props.getAllrequestSuccess(filtervalue,pageNumber,numEachPage);
  };

  return (
    <div>
      <div>
        <h1 style={{ fontSize: 20,}}>Access Requests</h1>
      </div>

      <Row>
        <Select
          defaultValue="PENDING"
          onChange={(val) => {
            setFiltervalue(val)
            props.getAllrequestSuccess(val,1,numEachPage);
          }}
          style={{ width: 250, marginBottom: 12 }}
          size="large"
        >
          <Select.Option value="PENDING">Pending</Select.Option>

          <Select.Option value="ACCEPTED">Accepted</Select.Option>
          <Select.Option value="DENIED">Denied</Select.Option>
          <Select.Option value="ALL">All</Select.Option>
        </Select>
        <Col span={20}>
          <Table
            loading={props.loading}
            columns={columns}
            dataSource={props.requests}
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
        <Col></Col>
      </Row>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    requests: state.allrequestsreducer.requests,
    loading: state.allrequestsreducer.loading,
    error: state.allrequestsreducer.error,
    count: state.allrequestsreducer.count
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllrequestSuccess: (status,page,limit) => dispatch(getAllrequestSuccess(status,page,limit)),
    requestCreate: (formData) => dispatch(requestCreate(formData)),
    acceptORdenyrequest: (id, type, data) =>
      dispatch(acceptORdenyrequest(id, type, data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuth(AccessRequests));
