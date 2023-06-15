import { combineReducers } from "redux";
import { messageReducer } from "./Messages/messagesReducers";
import { themeReducer } from "./Theme/themeReducers";
import allcustomersreducer from "./Customer/customerReducers";
import allrequestsreducer from "./Requests/requestsReducers";
import allpermitedreducer from "./PermitedAccess/permitedReducers";
import auth_reducer from "./Authentication/authreducer";
import usersreducer from "./UserManagment/userReducer";
import profile_reducer from "./Profile/Profilereducer"
const rootReducer = combineReducers({
  messageReducer: messageReducer,
  themeReducer: themeReducer,
  allcustomersreducer: allcustomersreducer,
  allrequestsreducer: allrequestsreducer,
  allpermitedreducer: allpermitedreducer,
  auth_reducer: auth_reducer,
  usersreducer: usersreducer,
  profile_reducer:profile_reducer
});

export default rootReducer;
