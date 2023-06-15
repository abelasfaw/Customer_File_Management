import React, { useState, useEffect } from "react";
import WithAuth from "../utils/protectRoute";
import {
  InboxOutlined,
  UserOutlined,
  FileOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import {
  Input,
  Row,
  Col,
  Upload,
  Table,
  Avatar,
  Space,
  Breadcrumb,
  Button,
  Divider,
  Empty,
  Select,
} from "antd";
import { connect } from "react-redux";
import LoadingComponent from "../Components/loadingComponent";
import { useRouter } from "next/router";

import {
  getAllcustomerSuccess,
  customerFileCreate,
  customerFileFetch,
  customerFileFetchFileroom,
  customerFileCreateOffice,
} from "./../store";
const { Search } = Input;
const { Dragger } = Upload;

const fileList = [];

let dataSource = [];

function Filemanagment(props) {
  const router = useRouter();
  const [breaditems, setbreaditems] = useState(["Home"]);
  const [selectedtype, setselectedtype] = useState("");
  const [fileList, setFileList] = useState([]);
  const [globalToken, setglobalToken] = useState(null);
  const userRoles = localStorage.getItem("type");

  const formData = new FormData();

  useEffect(() => {
    if (router.isReady) {
      const { token, id } = router.query;

      if (token != undefined) {
        setglobalToken(token);

        console.log(id);
        props.getAllcustomerSuccess(id);
      }
    }
  }, [router.isReady]);

  const columns = [
    {
      title: "File name",
      dataIndex: "name",
      key: "Filename",

      render: (text, record) => (
        <div>
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
                onClick={() => {
                  if (globalToken == null) {
                    props.customerFileFetchFileroom(
                      props.customer[0]._id,
                      record.name,
                      record.type
                    );
                  } else {
                    props.customerFileFetch(
                      globalToken,
                      props.customer[0]._id,
                      record.name,
                      record.type
                    );
                  }
                }}
                style={{
                  fontWeight: "bold",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                }}
              >
                {record.name}
              </div>
              {/* <div>{record.Filesize}</div> */}
            </Space>
          </Space>
        </div>
      ),
    },
    {
      title: "File Type",
      dataIndex: "type",
      key: "Filesize",
    },
    {
      title: "File size",
      dataIndex: "Filesize",
      key: "Filesize",
    },
    {
      title: "Date uploaded",
      dataIndex: "Dateuploaded",
      key: "Dateuploaded",
    },

    {
      title: "",
      dataIndex: "",
      key: "delete",
      render: () => (
        <div style={{ color: "#DA3633" }}>
          <a>Delete</a>
        </div>
      ),
    },
  ];

  console.log(props.customer);

  if (props.customer.length > 0) {
    if (props.customer[0].files != undefined) {
      dataSource = props.customer[0].files;
    }
  }
  return (
    <div>
      <Row gutter={24}>
        <Col span={20}>
          <Row gutter={[0, 24]}>
            {userRoles != "ADMIN" && userRoles!="FILE-ROOM" ? (
              <></>
            ) : (
              <Col span={24}>
                {" "}
                <Search
                  placeholder="Search by Registration Id"
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
                    <>
                      <Breadcrumb separator=">">
                        {breaditems.map((e, i) => {
                          return (
                            <Breadcrumb.Item key={i}>
                              {" "}
                              <Button
                                type="link"
                                style={{ color: "#718AC1" }}
                                onClick={() => {
                                  setselectedtype("");
                                  setbreaditems(["Home"]);
                                }}
                              >
                                {e === "Home" ? <UserOutlined /> : <></>}
                                <span style={{ fontSize: 17 }}>{e}</span>
                              </Button>{" "}
                            </Breadcrumb.Item>
                          );
                        })}
                      </Breadcrumb>
                      <Col span={24}>
                        {selectedtype == "" ? (
                          <></>
                        ) : (
                          <>
                            <div
                              style={{ maxHeight: "250px", overflow: "auto" }}
                            >
                              <Dragger
                                listType="picture"
                                FileList={fileList}
                                onChange={({ fileList: newFileList }) => {
                                  setFileList(newFileList);
                                }}
                                maxCount={1}
                              >
                                <p className="ant-upload-drag-icon">
                                  <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                  Click or drag file to this area to upload to
                                  this folder.
                                </p>
                              </Dragger>
                            </div>
                            <>
                              {fileList.length > 0 ? (
                                <Button
                                  loading={props.loading}
                                  type="primary"
                                  style={{ margin: "10px 0px" }}
                                  onClick={() => {
                                    console.log(fileList[0].originFileObj);

                                    formData.append(
                                      "file",
                                      fileList[0].originFileObj
                                    );

                                    if (userRoles == "ADMIN" || userRoles=="FILE-ROOM") {
                                      props.customerFileCreate(
                                        formData,
                                        e["_id"],
                                        selectedtype,
                                        props.customer
                                      );
                                    } else {
                                      console.log(globalToken)
                                      props.customerFileCreateOffice(
                                        formData,
                                        e["_id"],
                                        selectedtype,
                                        props.customer,
                                        globalToken
                                      );
                                    }
                                  }}
                                >
                                  Upload File To Folder
                                </Button>
                              ) : (
                                <></>
                              )}
                            </>
                          </>
                        )}
                      </Col>
                      <Col span={24}>
                        {breaditems.length < 2 ? (
                          <Table
                            dataSource={[
                              {
                                key: "1",
                                Foldername: "RECEIPT",
                                Filecount: `${
                                  dataSource.filter((e) => {
                                    return e.type == "RECEIPT";
                                  }).length
                                } files`,
                              },
                              {
                                key: "2",
                                Foldername: "AGREEMENT",
                                Filecount: `${
                                  dataSource.filter((e) => {
                                    return e.type == "AGREEMENT";
                                  }).length
                                } files`,
                              },
                              {
                                key: "3",
                                Foldername: "APPLICATION",
                                Filecount: `${
                                  dataSource.filter((e) => {
                                    return e.type == "APPLICATION";
                                  }).length
                                } files`,
                              },
                              {
                                key: "4",
                                Foldername: "LICENSE",
                                Filecount: `${
                                  dataSource.filter((e) => {
                                    return e.type == "LICENSE";
                                  }).length
                                } files`,
                              },
                              {
                                key: "5",
                                Foldername: "OTHERS",
                                Filecount: `${
                                  dataSource.filter((e) => {
                                    return e.type == "OTHERS";
                                  }).length
                                } files`,
                              },
                            ]}
                            columns={[
                              {
                                title: "Folder name",
                                dataIndex: "Foldername",
                                key: "Foldername",

                                render: (text, record) => (
                                  <div>
                                    <Space size="small" align="start">
                                      <Avatar
                                        style={{
                                          backgroundColor:
                                            "rgba(67, 76, 231,0.2)",
                                        }}
                                        icon={
                                          <FolderOpenOutlined
                                            style={{
                                              color: "rgba(67, 76, 231,0.9)",
                                            }}
                                          />
                                        }
                                      />
                                      <Space size={2} direction="vertical">
                                        <div
                                          onClick={() => {
                                            setselectedtype(record.Foldername);
                                            setbreaditems([
                                              "Home",
                                              record.Foldername,
                                            ]);
                                          }}
                                          style={{
                                            fontWeight: "bold",
                                            textOverflow: "ellipsis",
                                            cursor: "pointer",
                                          }}
                                        >
                                          {record.Foldername}
                                        </div>
                                      </Space>
                                    </Space>
                                  </div>
                                ),
                              },
                              {
                                title: "Items Count",
                                dataIndex: "Filecount",
                                key: "Filecount",
                                render: (text, record) => (
                                  <div
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: 15,
                                    }}
                                  >
                                    {record.Filecount}
                                  </div>
                                ),
                              },
                            ]}
                            pagination={{
                              responsive: true,
                              hideOnSinglePage: true,
                            }}
                          />
                        ) : (
                          <Table
                            dataSource={dataSource.filter((e) => {
                              return e.type == selectedtype;
                            })}
                            columns={columns}
                            pagination={{
                              responsive: true,
                              hideOnSinglePage: true,
                            }}
                          />
                        )}
                      </Col>
                    </>
                  );
                })}
              </>
            )}
          </Row>
        </Col>
      </Row>
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
    customerFileCreate: (formData, id, type, customer) =>
      dispatch(customerFileCreate(formData, id, type, customer)),

    customerFileCreateOffice: (formData, id, type, customer, token) =>
      dispatch(customerFileCreateOffice(formData, id, type, customer, token)),

    customerFileFetch: (tokenpassed, id, filename, type) =>
      dispatch(customerFileFetch(tokenpassed, id, filename, type)),

    customerFileFetchFileroom: (id, filename, type) =>
      dispatch(customerFileFetchFileroom(id, filename, type)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithAuth(Filemanagment));
