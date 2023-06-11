import React, { useState, useEffect } from "react";
import { Switch, Button, Col, Drawer, Row, Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import useWindowSize from "../../utils/windowsSize";
import { setDarkTheme, setLightTheme } from "../../store";
import { connect } from "react-redux";

import { primary_color } from "../../utils/constants";
function NavBar({ menu, setDark, setLight }) {
  const [visible, setVisible] = useState(false);

  const { width } = useWindowSize();



  return (
    <Layout.Header
      style={{
        backgroundColor: primary_color,
      }}
    >
      <Row style={{ paddingRight: "20px" }} justify="space-between">
        <Col>
          <Button
            style={width > 992 ? { display: "none" } : {}}
            icon={<MenuOutlined />}
            onClick={() => setVisible(true)}
          />
          <Drawer
            bodyStyle={{
              padding: "0",
            }}
            headerStyle={{
              paddingLeft: "2rem",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
            closable={false}
            placement="left"
            onClick={() => setVisible(false)}
            onClose={() => setVisible(false)}
            visible={visible}
          >
            {menu}
          </Drawer>

          <img
            src="/Seleda-Logo-04.png"
            style={{ height: "100%", maxHeight: "50px", width: "auto" }}
          />
          {/* </div> */}
        </Col>
        <Col>
          <Row align="middle">
            <span className="avatar-item">
              {
                <Switch
                  checkedChildren={
                    <LightModeIcon style={{ fontSize: "18px" }} />
                  }
                  unCheckedChildren={
                    <DarkModeIcon style={{ fontSize: "18px" }} />
                  }
                  defaultChecked={false}
                  onChange={(checked) => {
                    checked ? setDark() : setLight();
                  }}
                />
              }
            </span>
          </Row>
        </Col>
      </Row>
    </Layout.Header>
  );
}

const mapStateToProps = (state) => {
  return {
    theme: state.themeReducer.darkTheme,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setLight: () => dispatch(setLightTheme()),
    setDark: () => dispatch(setDarkTheme()),
  };
};
export default connect(mapStateToProps,mapDispatchToProps)(NavBar);
