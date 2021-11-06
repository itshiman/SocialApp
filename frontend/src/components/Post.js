import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@material-ui/core";

import React, { useContext, useEffect, useState } from "react";
import { Favorite, MoreVert, Share } from "@material-ui/icons";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  media: {
    height: "400px",

    [theme.breakpoints.down("sm")]: {
      height: 150,
    },
  },
  card: {
    marginBottom: theme.spacing(5),
  },
  container: {
    height: 50,
    widht: 50,
    backgroundColor: "black",
  },
  avatar: {
    backgroundColor: "blue",
  },
  likeButton: {
    color: "red",
  },
}));

const Posts = ({ post, index }) => {
  const classes = useStyles();
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("/users?userId=" + post.userId, {
        headers: {
          Authorization: "bearer " + currentUser.token,
        },
      });
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId, currentUser.token]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <>
      {/* <Container className={classes.container}></Container> */}
      <Card className={classes.card} id={post._id}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Link to={`/Profile/${user.username}`}>
                <Avatar alt={user.username} src={user.profilePicture} />
              </Link>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVert />
              </IconButton>
            }
            title={user.username}
            subheader={format(post.createdAt)}
          />
          {post.image ? (
            <CardMedia
              className={classes.media}
              image={"http://localhost:3000/images/" + post.image}
              title="My post"
            />
          ) : (
            <></>
          )}

          <CardContent>
            <Typography variant="h5">{post.title}</Typography>
            <Typography gutterBottom variant="body2">
              {post.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton aria-label="share" lef>
            <Share />
          </IconButton>
          {isLiked ? (
            <IconButton aria-label="add to favorites">
              <Favorite onClick={likeHandler} className={classes.likeButton} />
            </IconButton>
          ) : (
            <IconButton aria-label="add to favorites" onClick={likeHandler}>
              <Favorite />
            </IconButton>
          )}
          <Typography>{like} people Like this</Typography>
          <Typography> | post number {index} </Typography>
        </CardActions>
      </Card>
    </>
  );
};

export default Posts;
