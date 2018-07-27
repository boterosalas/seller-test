/**
 * Environments
 */
export const environment = {
  production: false,
  auth0: {
    url: 'https://leo2707.auth0.com',
    client_id: 'DzNRbDio6fj86E7VZMwZHgZnOaJ8-c84',
    client_secret: 'V9i0jfaBTj3z3Nin2i7ImcC0Znapqnq2D2DyQt0qJiA00WXhl516fz6EzUm4kzWP'
  },
  apiUrl: 'http://ec2-54-210-36-240.compute-1.amazonaws.com/',
  webUrl: 'http://sellershop.com/user_metadata',
  endpoints: {
    seller: '',
    // seller: 'http://ec2-34-200-30-156.compute-1.amazonaws.com/api',
    shipments: 'http://ec2-54-157-210-146.compute-1.amazonaws.com/api'
  },
   // constantes para cognito productivo
   region: 'us-east-1',
   identityPoolId: '',
   userPoolId: 'us-east-1_jkYIlpzxO',
   clientId: '1qhkrhnhjq3171otjfqe8k1h9u',
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
