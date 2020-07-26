# Secure Markdown Editor

## Frontend

The frontend of the application is made with React and Typescript.
Some of the libraries used:

- antd: UI library for quickly building the various interfaces of the app.
- styled-components: CSS library for writing CSS-in-JS.
- aws-amplify: Helpers for communicating with the backend
- react-markdown: Library for editing and rendering markdown text.

**Note 1:** I could have skipped the **react-markdown** library and instead use native HTML
rendering of markdown, but as simplest way would use the method `[DangerouslySetInnerHTML]` which is well... dangerous, I preferred to use a well-known and secure library for out of the box safety.
`;

**Note 2:** As the application is small, instead of using a mature global state management like Redux, I decided to build a simple redux-like state management by taking advantage of ContextAPI and useReducer/useContext hooks.

## Backend

AWS Amplify was used to quickly scaffold a basic serverless REST API and an authentication system.
Services used:

- Authentication: AWS Cognito
- Database: DynamoDB
- API: Node/express on a serverless function
