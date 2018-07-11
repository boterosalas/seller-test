/**
 * Environments
 */
export const environment = {
  production: true,
  auth0: {
    url: 'https://leo2707.auth0.com',
    client_id: 'DzNRbDio6fj86E7VZMwZHgZnOaJ8-c84',
    client_secret: 'V9i0jfaBTj3z3Nin2i7ImcC0Znapqnq2D2DyQt0qJiA00WXhl516fz6EzUm4kzWP'
  },
  apiUrl: '/api',
  webUrl: '',
  endpoints: {
    seller: '',
    shipments: 'https://envios.exito.com/api'
  },
   // constantes para cognito
   region: 'us-east-1',
   identityPoolId: '',
   userPoolId: 'us-east-1_5vEqf5WT0',
   clientId: '6sovc853lkkuk7km70jlvlu8u2',
   rekognitionBucket: 'rekognition-pics',
   albumName: 'usercontent',
   bucketRegion: 'us-east-1',
   ddbTableName: 'LoginTrail',
   cognito_idp_endpoint: '',
   cognito_identity_endpoint: '',
   sts_endpoint: '',
   dynamodb_endpoint: '',
   s3_endpoint: ''
};
