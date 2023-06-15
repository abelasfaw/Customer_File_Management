import React, { useMemo } from "react";
import { connect } from "react-redux";
import { messageNull } from "../../store/index";
import { useRouter } from "next/router"; 
import { notification } from "antd";
const Context = React.createContext({
  name: "Default",
});

function Message(props) {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();


  // SET_MESSAGE_INFO
  const SuccessMessage = (msg) => {
    notification.destroy();

    return api.success({
      key: msg,
      message: msg,
      placement: "topLeft",
    });
    
  };

  const InfoMessage = (title,msg) => {
    notification.destroy();
    return api.info({
      key: msg,
      description:msg,
      message: title,
      placement: "topLeft",
      style:{cursor:'pointer'},
      onClick:()=>{
        router.push('/access-requests')
      }
    });
  };

  const ErrorMessage = (msg) => {
    notification.destroy();
    return api.error({
      key: msg,
      message: msg,
      placement: "topLeft",
    });
  };

  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );

  return (
    <>
      <Context.Provider value={contextValue}>
        {contextHolder}
        <div>
          {props.visible ? (
            <>
              {props.type == "success"
                ? SuccessMessage(props.msg)
                : props.type == "error"
                ? ErrorMessage(props.msg)
                : props.type == "info"
                ? InfoMessage(props.title,props.msg)
                : ""}
            </>
          ) : (
            ""
          )}
        </div>
      </Context.Provider>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    visible: state.messageReducer.msgVisible,
    msg: state.messageReducer.msg,
    title:state.messageReducer.msgTitle,
    type: state.messageReducer.msgType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    messageNull: () => dispatch(messageNull()),
    loadingFalse: () => dispatch(loadingFalse()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);
