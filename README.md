# Secure Markdown Editor

### Live Demo: https://master.d3p4rqeeukp591.amplifyapp.com/

- **username:** demo
- **password:** 12345678

---

## Frontend

The frontend of the application is made with React and Typescript.
Some of the libraries used:

- **antd:** UI library for quickly building the various interfaces of the app.
- **styled-components:** CSS library for writing CSS-in-JS.
- **aws-amplify:** Helpers for communicating with the backend.
- **react-markdown:** Library for editing and rendering markdown text.

**Note 1:** I could have skipped the **react-markdown** library and instead use native HTML
rendering of markdown, but as the simplest way would use the method `DangerouslySetInnerHTML` which is well... dangerous, I preferred to use a well-known and secure library for out of the box safety.

**Note 2:** As the application is small, instead of using a full-fletched state management library like **Redux**, I decided to implement a simple redux-like state management by taking advantage of **ContextAPI** and **useReducer/useContext** hooks.

---

## Backend

AWS Amplify was used to quickly scaffold a basic serverless REST API and an authentication system.
Services used:

- **Authentication:** AWS Cognito
- **Database:** DynamoDB
- **API:** Node/Express on a serverless function

## To check it out locally:

1. Clone the repo
2. `yarn install`
3. `yarn start`

Run **`yarn test`** to run some unit tests.

---

## Things to improve

- Configure the editor to allow rendering HTML, but disable malicious options.
- Establish a style-guide and set some standard styles and components to be set once and be reused across the app.
- Style the whole application to be accessible in mobile devices.
- Add more tests and introduce e2e testing.
- Of course, use a real encrypt/decrypt service.
