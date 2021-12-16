import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  navbar: {
    backgroundColor: "#203040",
    "& a": {
      color: "#ffffff",
      marginLeft: 10,
    },
  },
  secondbar: {
    backgroundColor: "#2596be",
    "& a": {
      color: "#ffffff",
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: "bold",
    fontSize: " 1.5rem",
  },
  grow: {
    flexGrow: 1,
  },
  sizePlus: {
    fontSize: "20px",
  },
  main: {
    minHeight: "90vh",
    minWidth: "80vw",
  },
  footer: {
    textAlign: "center",
  },
  secondtext: {
    fontSize: "23px",
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  addButton: {
    primary: {
      main: "#2596be",
    },
    secondary: {
      main: "#208080",
    },
  },
});
export default useStyles;
