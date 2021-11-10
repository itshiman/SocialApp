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
import { CardHeader } from 'reactstrap';
import { AuthContext } from '../../context/AuthContext';

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
        const friendList = await axios.get('/users/friends/' + user._id);
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
      <div>Chat with your Friends</div>
      {console.log(friends)}
      {friends ? (
        friends.map((friend) => {
          return (
            <Card>
              <Link to={`/messenger`}>
                <CardActions>
                  <Avatar alt={user.username} src={user.profilePicture} />
                  <div style={{ leftMargin: '10px' }}>{friend.username}</div>
                </CardActions>
              </Link>
            </Card>
          );
        })
      ) : (
        <div>Follow Some People to add them as your Friend</div>
      )}
    </Container>
  );
};

export default Rightbar;
