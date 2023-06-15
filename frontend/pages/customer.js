import React, { useState, useEffect } from "react";
import WithAuth from "../utils/protectRoute";
import { useRouter } from "next/router";
import { primary_color } from "../utils/constants";
import {
  Input,
  Row,
  Col,
  Avatar,
  Space,
  Button,
  Divider,
  Modal,
  Empty,
  Collapse,
} from "antd";
import Addcustomer from "../Components/CustomerComponents/add-customer";
import { connect } from "react-redux";
import {
  getAllcustomerSuccess,
  AllcustomerEdit,
  customerCreate,
  requestCreate,
} from "./../store";
import LoadingComponent from "../Components/loadingComponent";
import { UserOutlined, FileOutlined } from "@ant-design/icons";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Padding } from "@mui/icons-material";

const { Search } = Input;

const iconprops = {
  fontSize: 15,
  color: primary_color,
};

let files = [];

const SingleUserDetailElement = ({ icon, title, value }) => {
  return (
    <div>
      {" "}
      <Space align="start" size={4} style={{ margin: "2px 0px" }}>
        <Space align="end" size={1}>
          {icon}
          <div style={{ fontSize: 16, fontWeight: 500 }}>
            <span style={{ color: primary_color }}>
              {title}: {"  "}
            </span>
          </div>
        </Space>{" "}
        <span style={{ fontSize: 16, fontWeight: 600 }}>
          {"  "}
          {value}
        </span>
      </Space>
    </div>
  );
};

const CardComponent = ({ record }) => {
  return (
    <div>
      <Divider style={{ Padding: 0, margin: 5 }} />
      <Space size="small" align="start">
        <Avatar
          style={{
            backgroundColor: "rgba(67, 76, 231,0.2)",
          }}
          icon={
            <FileOutlined
              style={{
                color: "rgba(67, 76, 231,0.9)",
              }}
            />
          }
        />
        <Space size={2} direction="vertical">
          <div
            style={{
              fontWeight: "bold",
              textOverflow: "ellipsis",
            }}
          >
            {record.name}
          </div>
          <div style={{ fontSize: 14 }}>{record.type}</div>
        </Space>
      </Space>
    </div>
  );
};

function Customer(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editingData, setEditingData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    registrationNumber: "",
  });

  const [globalToken, setglobalToken] = useState(null);

  const router = useRouter();
  const userRoles = localStorage.getItem("type");

  // let globalToken = null;

  useEffect(() => {
    if (router.isReady) {
      const { token, customer } = router.query;

      if (token != undefined) {
        setglobalToken(token);

        console.log(customer);
        props.getAllcustomerSuccess(customer);
      }
    }
  }, [router.isReady]);

  if (props.customer.length > 0) {
    if (props.customer[0].files != undefined) {
      files = props.customer[0].files;
    }
  }

  return (
    <div>
      <Row gutter={24}>
        <Col span={19}>
          <Row gutter={[0, 24]}>
            {globalToken != null ? (
              <></>
            ) : (
              <Col span={24}>
                {" "}
                <Search
                  placeholder="Search by Registration Id"
                  // defaultValue="A0159"
                  enterButton="Search"
                  size="large"
                  loading={props.loading}
                  onSearch={(e) => {
                    console.log(e);
                    props.getAllcustomerSuccess(e);
                  }}
                />
              </Col>
            )}
            <Col span={22} offset={1}>
              {props.loading ? (
                <>
                  <LoadingComponent minHeight="50vh" />
                </>
              ) : props.customer.length == 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Empty
                    image={"/empty-trey.png"}
                    description="Please Search to see a detail."
                  />
                </div>
              ) : (
                <>
                  {props.customer.map((e, i) => {
                    return (
                      <Row key={i}>
                        {" "}
                        <Col span={16}>
                          <div>
                            <Space size={15}>
                              <Avatar
                                shape="square"
                                size={64}
                                icon={<UserOutlined />}
                              />

                              <h1 style={{ fontSize: 26 }}>
                                {e.firstName} {e.middleName} {e.lastName}
                              </h1>
                            </Space>
                            <Divider
                              orientation="left"
                              style={{
                                borderColor: "#ccc",
                              }}
                            >
                              User Details
                            </Divider>

                            <SingleUserDetailElement
                              icon={<PhoneIcon style={{ ...iconprops }} />}
                              title="Telephone"
                              value={`+251-${e.phoneNumber}`}
                            />
                            <SingleUserDetailElement
                              icon={<HomeIcon style={{ ...iconprops }} />}
                              title="Registration Number"
                              value={e.registrationNumber}
                            />
                            <SingleUserDetailElement
                              icon={
                                <CalendarMonthIcon style={{ ...iconprops }} />
                              }
                              title="Registry Date"
                              value={Date(Date.parse(e.createdAt))}
                            />
                            <Divider
                              orientation="left"
                              style={{
                                borderColor: "#ccc",
                              }}
                            >
                              File Details
                            </Divider>
                            <Collapse
                              size="large"
                              defaultActiveKey={1}
                              accordion={true}
                              bordered={false}
                            >
                              <Collapse.Panel
                                header={
                                  <div
                                    style={{
                                      color: primary_color,
                                      fontSize: 17,
                                    }}
                                  >
                                    RECEIPTS
                                  </div>
                                }
                                key="1"
                                style={{
                                  backgroundColor: "#F5F5F5",
                                  borderRadius: 8,
                                  border: `1px solid #CCCCCC`,
                                }}
                              >
                                <div
                                  style={{
                                    height: 200,
                                    overflow: "scroll",
                                    overflowX: "hidden",
                                  }}
                                >
                                  {files
                                    .filter((e) => e.type == "RECEIPT")
                                    .map((record, i) => {
                                      return (
                                        <div key={i}>
                                          <CardComponent record={record} />
                                        </div>
                                      );
                                    })}
                                </div>
                              </Collapse.Panel>
                              <Collapse.Panel
                                header={
                                  <div
                                    style={{
                                      color: primary_color,
                                      fontSize: 17,
                                    }}
                                  >
                                    AGREEMENTS
                                  </div>
                                }
                                key="2"
                                style={{
                                  backgroundColor: "#F5F5F5",
                                  borderRadius: 8,
                                  border: `1px solid #CCCCCC`,
                                }}
                              >
                                <div
                                  style={{
                                    height: 200,
                                    overflow: "scroll",
                                    overflowX: "hidden",
                                  }}
                                >
                                  {files
                                    .filter((e) => e.type == "AGREEMENT")
                                    .map((record, i) => {
                                      return (
                                        <CardComponent
                                          record={record}
                                          key={i}
                                        />
                                      );
                                    })}
                                </div>
                              </Collapse.Panel>
                              <Collapse.Panel
                                header={
                                  <div
                                    style={{
                                      color: primary_color,
                                      fontSize: 17,
                                    }}
                                  >
                                    APPLICATIONS
                                  </div>
                                }
                                key="3"
                                style={{
                                  backgroundColor: "#F5F5F5",
                                  borderRadius: 8,
                                  border: `1px solid #CCCCCC`,
                                }}
                              >
                                <div
                                  style={{
                                    height: 200,
                                    overflow: "scroll",
                                    overflowX: "hidden",
                                  }}
                                >
                                  {files
                                    .filter((e) => e.type == "APPLICATION")
                                    .map((record, i) => {
                                      return (
                                        <CardComponent
                                          record={record}
                                          key={i}
                                        />
                                      );
                                    })}
                                </div>
                              </Collapse.Panel>
                              <Collapse.Panel
                                header={
                                  <div
                                    style={{
                                      color: primary_color,
                                      fontSize: 17,
                                    }}
                                  >
                                    LICENSE
                                  </div>
                                }
                                key="4"
                                style={{
                                  backgroundColor: "#F5F5F5",
                                  borderRadius: 8,
                                  border: `1px solid #CCCCCC`,
                                }}
                              >
                                <div
                                  style={{
                                    height: 200,
                                    overflow: "scroll",
                                    overflowX: "hidden",
                                  }}
                                >
                                  {files
                                    .filter((e) => e.type == "LICENSE")
                                    .map((record, i) => {
                                      return (
                                        <CardComponent
                                          record={record}
                                          key={i}
                                        />
                                      );
                                    })}
                                </div>
                              </Collapse.Panel>
                              <Collapse.Panel
                                header={
                                  <div
                                    style={{
                                      color: primary_color,
                                      fontSize: 17,
                                    }}
                                  >
                                    OTHERS
                                  </div>
                                }
                                key="5"
                                style={{
                                  backgroundColor: "#F5F5F5",
                                  borderRadius: 8,
                                  border: `1px solid #CCCCCC`,
                                }}
                              >
                                <div
                                  style={{
                                    height: 200,
                                    overflow: "scroll",
                                    overflowX: "hidden",
                                  }}
                                >
                                  {" "}
                                  {files
                                    .filter((e) => e.type == "OTHERS")
                                    .map((record, i) => {
                                      return (
                                        <CardComponent
                                          record={record}
                                          key={i}
                                        />
                                      );
                                    })}{" "}
                                </div>
                              </Collapse.Panel>
                            </Collapse>
                          </div>
                        </Col>
                        <Col
                          flex={"auto"}
                          offset={3}
                          style={{ marginTop: "20px" }}
                        >
                          {userRoles != "ADMIN" && userRoles != "FILE-ROOM" ? (
                            <>
                              {globalToken != null ? (
                                <Button
                                  type="primary"
                                  ghost
                                  block
                                  onClick={() => {
                                    router.push({
                                      pathname: "/file-managment",
                                      query: {
                                        token: globalToken,
                                        id: e.registrationNumber,
                                      },
                                    });
                                  }}
                                >
                                  Go to files
                                </Button>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <>
                              <div style={{ margin: "7px 0px" }}>
                                <Button
                                  type="primary"
                                  ghost
                                  block
                                  onClick={() => {
                                    router.push(
                                      `file-managment?id=${e.registrationNumber}`
                                    );
                                  }}
                                >
                                  Go to files
                                </Button>
                              </div>
                              <div style={{ margin: "7px 0px" }}>
                                {/* <Button
                                  type="primary"
                                  block
                                  onClick={() => {
                                    let d = props.customer[0];
                                    setIsEditing(true);
                                    setEditingData({
                                      firstName: d.firstName,
                                      middleName: d.middleName,
                                      lastName: d.lastName,
                                      phoneNumber: d.phoneNumber,
                                      registrationNumber: d.registrationNumber,
                                    });
                                    setIsModalOpen(true);
                                  }}
                                >
                                  Edit User
                                </Button> */}
                              </div>
                            </>
                          )}

                          {userRoles == "ADMIN" || userRoles == "FILE-ROOM" ? (
                            <></>
                          ) : (
                            <div style={{ margin: "7px 0px" }}>
                              {globalToken != null ? (
                                <></>
                              ) : (
                                <Button
                                  type="primary"
                                  ghost
                                  block
                                  onClick={() => {
                                    props.requestCreate({ customer_id: e._id });
                                  }}
                                >
                                  Request Permission
                                </Button>
                              )}
                            </div>
                          )}
                        </Col>
                      </Row>
                    );
                  })}
                </>
              )}
            </Col>
          </Row>
        </Col>
        <Col span={4} offset={1}>
          {userRoles == "ADMIN" || userRoles == "FILE-ROOM" ? (
            <Button
              type="primary"
              block
              onClick={() => {
                setEditingData({
                  firstName: "",
                  middleName: "",
                  lastName: "",
                  phoneNumber: "",
                  registrationNumber: "",
                });
                setIsModalOpen(true);
              }}
            >
              Add customer
            </Button>
          ) : (
            <></>
          )}
        </Col>
      </Row>

      <Modal
        title="Add Customer"
        closable
        footer={null}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditing(false);
        }}
      >
        <Addcustomer
          loading={props.loading}
          onSubmit={(e) => {
            props.customerCreate(e);
          }}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          isEditing={isEditing}
          customerData={editingData}
        />
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    customer: state.allcustomersreducer.customer,
    loading: state.allcustomersreducer.loading,
    error: state.allcustomersreducer.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllcustomerSuccess: (regId) => dispatch(getAllcustomerSuccess(regId)),
    AllcustomerEdit: (id, customers, edited) =>
      dispatch(AllcustomerEdit(id, customers, edited)),
    customerCreate: (formData) => dispatch(customerCreate(formData)),
    requestCreate: (f) => dispatch(requestCreate(f)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuth(Customer));
