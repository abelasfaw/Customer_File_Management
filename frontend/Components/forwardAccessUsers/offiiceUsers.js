import { Table, Button } from "antd";
import React from "react";

function OfficeUsers({ users, loading, onClick }) {
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
      title: "",
      key: "",
      render: (text, record) => (
        <>
          <Button
            
            type="primary"
            onClick={() => {
              onClick(record._id);
            }}
          >
            Forward
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Table
        dataSource={users}
        loading={loading}
        columns={columns}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
    </div>
  );
}

export default OfficeUsers;
