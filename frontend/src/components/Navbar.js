import {
  AppBar,
  Avatar,
  Badge,
  InputBase,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  Cancel,
  Forum,
  Mail,
  Notifications,
  PowerSettingsNew,
  Search,
} from '@material-ui/icons';
import { makeStyles, alpha } from '@material-ui/core/styles';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const useStyles = makeStyles((theme) => ({
  typography: {
    color: 'white',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      display: (props) => (props.open ? 'flex' : 'none'),
      width: '70%',
    },
  },
  searchButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  searchIcon: {
    marginLeft: theme.spacing(1),
  },
  searchInput: {
    color: 'white',
    marginLeft: theme.spacing(1),
  },
  icons: {
    alignItems: 'center',
    display: (props) => (props.open ? 'none' : 'flex'),
  },
  badge: {
    marginRight: theme.spacing(2),
  },
  searchCancelButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));
const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const classes = useStyles({ open });

  const [inputValue, setInputValue] = useState();

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AppBar position='fixed'>
      <Toolbar className={classes.toolbar}>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <Typography variant='h6' className={classes.typography}>
            App
          </Typography>
        </Link>
        <div className={classes.search}>
          {inputValue ? (
            <Link
              to={'/Profile/' + inputValue}
              style={{ textDecoration: 'none', color: 'white' }}>
              <Search className={classes.searchIcon} />
            </Link>
          ) : (
            <Search className={classes.searchIcon} />
          )}

          <InputBase
            placeholder='Search...'
            className={classes.searchInput}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <Cancel
            className={classes.searchCancelButton}
            onClick={() => setOpen(false)}
          />
        </div>
        <div className={classes.icons}>
          <Link
            to='/messenger'
            style={{ textDecoration: 'none', color: 'white' }}>
            <Forum className={classes.badge} />
          </Link>
          <Search
            className={classes.searchButton}
            onClick={() => setOpen(true)}
          />
          {/* <Badge badgeContent={4} color='secondary' className={classes.badge}>
            <Mail />
          </Badge>
          <Badge badgeContent={4} color='secondary' className={classes.badge}>
            <Notifications />
          </Badge> */}

          <Link to={`/Profile/${user.username}`}>
            <Avatar
              className={classes.avatar}
              alt={user.username}
              src={user.profilePicture}
            />
          </Link>
          <PowerSettingsNew
            onClick={handleLogout}
            style={{ marginLeft: '10px' }}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
