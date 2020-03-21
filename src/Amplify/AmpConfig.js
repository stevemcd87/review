import Amplify, { Auth } from "aws-amplify";

const AmpConfig = {
  Interactions: {
    bots: {
      PizzaOrderingBot: {
        name: "PizzaOrderingBot",
        alias: "ALIAS",
        region: "us-east-1"
      }
    }
  },
  Storage: {
    AWSS3: {
      bucket: "studdiebuddie", //REQUIRED -  Amazon S3 bucket
      region: "us-east-1" //OPTIONAL -  Amazon service region
    }
  },
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: "us-east-1:0e4605ba-610f-47c0-b65b-bb364df3e48e",

    // REQUIRED - Amazon Cognito Region
    region: "us-east-1",

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    // identityPoolRegion: "XX-XXXX-X",

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "us-east-1_vJBGrpPU4",

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "4lrud373702phmf1j8fj8d46k7",

    // // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false
    //
    // // OPTIONAL - Configuration for cookie storage
    // // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // cookieStorage: {
    // // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    //     domain: '.yourdomain.com',
    // // OPTIONAL - Cookie path
    //     path: '/',
    // // OPTIONAL - Cookie expiration in days
    //     expires: 365,
    // // OPTIONAL - Cookie secure flag
    // // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    //     secure: true
    // },

    // OPTIONAL - customized storage object
    // storage: new MyStorage(),
    //
    // // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH',
    //
    // // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    // clientMetadata: { myCustomKey: 'myCustomValue' },
    //
    //  // OPTIONAL - Hosted UI configuration
    // oauth: {
    //     domain: 'your_cognito_domain',
    //     scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    //     redirectSignIn: 'http://localhost:3000/',
    //     redirectSignOut: 'http://localhost:3000/',
    //     responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    // }
  },
  API: {
    endpoints: [
      {
        name: "StuddieBuddie",
        endpoint: "https://1dciz8ln4i.execute-api.us-east-1.amazonaws.com/dev",
        // custom_header: async () => {
        //   // return { Authorization: "token" };
        //   // Alternatively, with Cognito User Pools use this:
        //   return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
        // }
      }
    ]
  }
};

export default AmpConfig;
