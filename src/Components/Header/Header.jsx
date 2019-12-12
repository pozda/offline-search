// @flow
import React from "react";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import HomeIcon from "@material-ui/icons/Home";
import DonutSmallIcon from "@material-ui/icons/DonutSmall";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  }
}));

type Props = {
  handleQuery: (e: SyntheticInputEvent<HTMLInputElement>) => void,
  handleEnterKey: (e: SyntheticInputEvent<HTMLInputElement>) => void
};

const Header = (props: Props) => {
  const history = useHistory();
  const { handleQuery, handleEnterKey } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={() => history.push("/")}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="go home"
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            onClick={() => history.push("/database-sync")}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="go to database sync"
          >
            <DonutSmallIcon />
          </IconButton>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="search, press Enter"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={handleQuery}
              onKeyDown={handleEnterKey}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
