import {
  Link,
  Avatar,
  Container,
  ImageList,
  ImageListItem,
  makeStyles,
  Typography,
  Card,
  CardActions,
} from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Button, CardBody, CardHeader, CardTitle, Collapse } from 'reactstrap';
import { AuthContext } from '../../context/AuthContext';
import { serverUrl } from '../../config';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    position: 'sticky',
    top: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: '#555',
  },
  link: {
    marginRight: theme.spacing(2),
    color: '#555',
    fontSize: 16,
  },
}));

const Rightbar = () => {
  const classes = useStyles();
  const [friends, setFriends] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get(
          `${serverUrl}/users/friends/` + user._id
        );
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  return (
    <Container className={classes.container}>
      <Typography className={classes.title} gutterBottom>
        Online Friends
      </Typography>
      <AvatarGroup max={6} style={{ marginBottom: 20 }}>
        <Avatar alt='Remy Sharp' src='' />
        <Avatar alt='Travis Howard' src='' />
        <Avatar alt='Cindy Baker' src='' />
        <Avatar alt='Agnes Walker' src='' />
        <Avatar alt='Trevor Henderson' src='' />
        <Avatar alt='Trevor Henderson' src='' />
        <Avatar alt='Trevor Henderson' src='' />
      </AvatarGroup>
      <div>
        <Card>
          <CardBody>
            <CardTitle tag='h5'>Try these commands:</CardTitle>
            <Card style={{ marginTop: '5px' }}>
              <CardBody>
                <CardTitle tag='h6'>What Does this App do?</CardTitle>
              </CardBody>
            </Card>
            <Card style={{ marginTop: '5px' }}>
              <CardBody>
                <CardTitle tag='h6'>Make a Post</CardTitle>
                <div>
                  {' '}
                  Add the title, decription and share the post by saying these
                  commands:
                </div>
                <div>Add title</div>
                <div>Add Description</div>
                <div>Share the post</div>
              </CardBody>
            </Card>
            <Card style={{ marginTop: '5px' }}>
              <CardBody>
                <CardTitle tag='h6'>Read The post</CardTitle>
                <div>Read One Post</div>
                <div>Read All Posts</div>
              </CardBody>
            </Card>
            <Card style={{ marginTop: '5px' }}>
              <CardBody>
                <CardTitle tag='h6'>Misc. Commands</CardTitle>
                <div>Scroll Up</div>
                <div>Scroll Down</div>
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

export default Rightbar;
