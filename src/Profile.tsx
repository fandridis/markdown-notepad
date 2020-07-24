import React from "react";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import "./App.css";

function Profile() {
  return (
    <div style={containerStyle}>
      <AmplifySignOut />
    </div>
  );
}

const containerStyle = {
  width: 400,
  margin: "20px auto",
};

export default withAuthenticator(Profile);
