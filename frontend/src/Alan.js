import { useCallback, useEffect, useState } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";

const Commands = {
  MAKE_POST: "makePost",
  CLOSE_POST: "closePost",
  ADD_TITLE: "addTitle",
  ADD_DESC: "addDesc",
  ADD_FILE: "addFile",
  SHARE_POST: "sharePost",
  LOGOUT: "logout",
  SIGNUP: "signup",
  HOME: "home",
  USERNAME: "username",
  PASSWORD: "password",
  EMAIL: "email",
  SUBMIT: "submit",
  SCROLLDOWN: "scrolldown",
  SCROLLUP: "scrollup",
  WEBD: "webd",
  ALLPOST: "allpost",
  ONEPOST: "onepost",
};
//const alanKey = process.env.REACT_APP_ALAN_KEY;
const alanKey =
  "e7936d5b794fe44981199431a2315edc2e956eca572e1d8b807a3e2338fdd0dc/stage";
export default function Alan() {
  // const state = useGlobalState();
  const pathname = window.location.pathname;
  const [alanInstance, setAlanInstance] = useState();
  const [value, setValue] = useState("");
  const makePost = useCallback(() => {
    if (pathname == "/") {
      //   alanInstance.playText("ok , got it ?");
      document.getElementById("add").click();
    } else {
      alanInstance.playText("first go to feed page, then try");
    }
  }, [alanInstance]);

  const closePost = useCallback(() => {
    if (pathname == "/") {
      alanInstance.playText("ok ,let go again to the feed page");
      document.getElementById("cancel").click();
    } else {
      alanInstance.playText("something unusual happend can you try manually");
    }
  }, [alanInstance]);

  const addTitle = useCallback(
    ({ detail: payload }) => {
      console.log("fff", payload);
      if (pathname == "/") {
        document.getElementById("standard-basic-label").click();
        console.log("ddddddd", payload.value);
        document.getElementById("standard-basic").value = payload.value;
      } else {
        alanInstance.playText("something unusual happend can you try manually");
      }
    },
    [alanInstance]
  );

  const addDesc = useCallback(
    ({ detail: payload }) => {
      if (pathname == "/") {
        document.getElementById("standard-basic-1-label").click();
        document.getElementById("standard-basic-1").value = payload.value;
      } else {
        alanInstance.playText("something unusual happend can you try manually");
      }
    },
    [alanInstance]
  );

  const addFile = useCallback(() => {
    if (pathname == "/") {
      document.getElementById("file").click();
    } else {
      alanInstance.playText("something unusual happend can you try manually");
    }
  }, [alanInstance]);

  const sharePost = useCallback(() => {
    if (pathname == "/") {
      document.getElementById("share").click();
      alanInstance.playText("yes , the post get posted successfully");
    } else {
      alanInstance.playText("something unusual happend can you try manually");
    }
  }, [alanInstance]);

  const logout = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, [alanInstance]);

  const signup = useCallback(() => {
    window.location.href = "/signup";
  }, [alanInstance]);

  const home = useCallback(() => {
    window.location.href = "/";
  }, [alanInstance]);

  const username = useCallback(
    ({ detail: payload }) => {
      document.getElementById("username-label").click();
      document
        .getElementsByClassName(
          "MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth"
        )[0]
        .click();
      document.getElementById("username").value = payload.value;
    },
    [alanInstance]
  );

  const email = useCallback(
    ({ detail: payload }) => {
      document.getElementById("email-label").click();
      document
        .getElementsByClassName(
          "MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth"
        )[0]
        .click();
      document.getElementById("email").value = payload.value;
    },
    [alanInstance]
  );
  const password = useCallback(
    ({ detail: payload }) => {
      document.getElementById("password-label").click();
      document
        .getElementsByClassName(
          "MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth"
        )[0]
        .click();
      document.getElementById("password").value = payload.value;
    },
    [alanInstance]
  );
  const submit = useCallback(() => {
    console.log("eeeeeeeewwwwwwwww");
    document.getElementById("submit").click();
  }, [alanInstance]);

  const scrolldown = useCallback(() => {
    window.scrollBy(0, 800);
  }, [alanInstance]);

  const scrollup = useCallback(() => {
    window.scrollBy(0, -800);
  }, [alanInstance]);

  const webd = useCallback(() => {
    window.location.href = "/Profile/Web";
  }, [alanInstance]);

  const allpost = useCallback(() => {
    // const res = Data();
    // console.log("sssssssddddddd", res);
    // props.data.forEach((element) => {
    //   alanInstance.playText(`${element}`);
    // });
  }, [alanInstance]);

  const onepost = useCallback(
    ({ detail: payload }) => {
      const index = payload.value;
    },
    [alanInstance]
  );

  useEffect(() => {
    window.addEventListener(Commands.MAKE_POST, makePost);
    window.addEventListener(Commands.CLOSE_POST, closePost);
    window.addEventListener(Commands.ADD_TITLE, addTitle);
    window.addEventListener(Commands.ADD_DESC, addDesc);
    window.addEventListener(Commands.ADD_FILE, addFile);
    window.addEventListener(Commands.SHARE_POST, sharePost);
    window.addEventListener(Commands.LOGOUT, logout);
    window.addEventListener(Commands.SIGNUP, signup);
    window.addEventListener(Commands.HOME, home);
    window.addEventListener(Commands.USERNAME, username);
    window.addEventListener(Commands.EMAIL, email);
    window.addEventListener(Commands.PASSWORD, password);
    window.addEventListener(Commands.SUBMIT, submit);
    window.addEventListener(Commands.SCROLLDOWN, scrolldown);
    window.addEventListener(Commands.SCROLLUP, scrollup);
    window.addEventListener(Commands.WEBD, webd);
    window.addEventListener(Commands.ALLPOST, allpost);
    window.addEventListener(Commands.ONEPOST, onepost);

    return () => {
      window.removeEventListener(Commands.MAKE_POST, makePost);
      window.removeEventListener(Commands.CLOSE_POST, closePost);
      window.removeEventListener(Commands.ADD_TITLE, addTitle);
      window.removeEventListener(Commands.ADD_DESC, addDesc);
      window.removeEventListener(Commands.ADD_FILE, addFile);
      window.removeEventListener(Commands.SHARE_POST, sharePost);
      window.removeEventListener(Commands.LOGOUT, logout);
      window.removeEventListener(Commands.SIGNUP, signup);
      window.removeEventListener(Commands.HOME, home);
      window.removeEventListener(Commands.USERNAME, username);
      window.removeEventListener(Commands.EMAIL, email);
      window.removeEventListener(Commands.PASSWORD, password);
      window.removeEventListener(Commands.SUBMIT, submit);
      window.removeEventListener(Commands.SCROLLDOWN, scrolldown);
      window.removeEventListener(Commands.SCROLLUP, scrollup);
      window.removeEventListener(Commands.WEBD, webd);
      window.removeEventListener(Commands.ALLPOST, allpost);
      window.removeEventListener(Commands.ONEPOST, onepost);
    };
  }, [
    makePost,
    closePost,
    addTitle,
    addDesc,
    addFile,
    sharePost,
    logout,
    signup,
    home,
    username,
    email,
    password,
    submit,
    scrolldown,
    scrollup,
    webd,
    allpost,
    onepost,
  ]);
  useEffect(() => {
    if (alanInstance != null) return;

    setAlanInstance(
      alanBtn({
        left: "15px",
        zIndex: 10000,
        key: alanKey,
        onCommand: ({ command, payload }) => {
          console.log("payload", payload);
          window.dispatchEvent(new CustomEvent(command, { detail: payload }));
        },
      })
    );
  }, []);
  return null;
}
