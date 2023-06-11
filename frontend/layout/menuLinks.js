import DashboardIcon from "@mui/icons-material/Dashboard";
import SwitchAccessShortcutIcon from "@mui/icons-material/SwitchAccessShortcut";
import TopicIcon from "@mui/icons-material/Topic";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
export const adminmenu = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <DashboardIcon style={{ fontSize: "26px" }} />,
  },
  {
    name: "File Managment",
    link: "/file-managment",
    icon: <TopicIcon style={{ fontSize: "26px" }} />,
  },
  {
    name: "Customer Detail",
    link: "/customer",
    icon: <AccountBoxIcon style={{ fontSize: "26px" }} />,
  },
  {
    name: "Access Requests",
    link: "/access-requests",
    icon: <SwitchAccessShortcutIcon style={{ fontSize: "26px" }} />,
  },
  {
    name: "Users",
    link: "/users",
    icon: <PeopleAltIcon style={{ fontSize: "26px" }} />,
  },
  {
    name: "Customers",
    link: "/all-customers",
    icon: <PeopleAltIcon style={{ fontSize: "26px" }} />,
  },
];

export const fileroommenu = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <DashboardIcon style={{ fontSize: "26px" }} />,
  },
  {
    name: "File Managment",
    link: "/file-managment",
    icon: <TopicIcon style={{ fontSize: "26px" }} />,
  },
  {
    name: "Customer Detail",
    link: "/customer",
    icon: <AccountBoxIcon style={{ fontSize: "26px" }} />,
  },
  {
    name: "Access Requests",
    link: "/access-requests",
    icon: <SwitchAccessShortcutIcon style={{ fontSize: "26px" }} />,
  },
  {
    name: "Customers",
    link: "/all-customers",
    icon: <PeopleAltIcon style={{ fontSize: "26px" }} />,
  },
];

export const officemenu = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <DashboardIcon style={{ fontSize: "26px" }} />,
  },
  {
    name: "Customer",
    link: "/customer",
    icon: <AccountBoxIcon style={{ fontSize: "26px" }} />,
  },

  {
    name: "File Access",
    link: "/permited-access",
    icon: <SwitchAccessShortcutIcon style={{ fontSize: "26px" }} />,
  },
];

export const adminroutes = [
  "/dashboard",
  "/file-managment",
  "/access-requests",
  "/users",
  "/customer",
  "/all-customers"
];
export const fileroomroutes = [
  "/dashboard",
  "/file-managment",
  "/access-requests",
  "/customer",
  "/all-customers"
];
export const officeroutes = [
  "/dashboard",
  "/permited-access",
  "/customer",
];
