import { Auth } from "aws-amplify";

async function checkUser(updateUser: any) {
  const userData = await Auth.currentSession().catch((err) =>
    console.log("error: ", err)
  );

  if (!userData) {
    updateUser({});
    return;
  }
  //   const {
  //     idToken: { payload },
  //   } = userData;

  console.log("userData: ", userData);

  updateUser({
    // username: payload["cognito:username"],
    isAuthorized: true,
  });
}

export default checkUser;
