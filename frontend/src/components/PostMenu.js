import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
} from '@material-ui/core';
import zIndex from '@material-ui/core/styles/zIndex';
import { Cloud, Delete, Edit } from '@material-ui/icons';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function PostMenu(props) {
  const { user } = useContext(AuthContext);

  const deletePost = () => {
    try {
      axios.delete(`/posts/${props.post._id}`, {
        headers: {
          Authorization: 'bearer ' + user.token,
        },
      });
    } catch (err) {
      console.log(err);
    }
    props.handleClose();
    window.location.reload();
  };

  console.log(props.post);
  console.log(user);

  return (
    <div>
      <Menu
        id='basic-menu'
        anchorEl={props.anchorEl}
        open={props.open}
        onClose={props.handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        <MenuItem onClick={deletePost}>
          <ListItemIcon>
            <Delete fontSize='small' />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={props.handleClose}>
          <ListItemIcon>
            <Edit fontSize='small' />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
