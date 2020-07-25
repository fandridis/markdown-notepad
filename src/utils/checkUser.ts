import { Auth } from "aws-amplify";

async function checkUser(updateUser: any) {
  const userData = await Auth.currentSession().catch((err) =>
    console.log("error: ", err)
  );

  if (!userData) {
    updateUser({});
    return;
  }

  updateUser({
    username: userData.getIdToken().payload["cognito:username"],
    email: userData.getIdToken().payload["email"],
    isAuthorized: true,
  });
}

export default checkUser;
