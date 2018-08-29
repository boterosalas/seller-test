/**
 * Environments
 */
export const environment = {
  production: true,
  // Endpoints para la app 'group' coincide con una key de 'api-endpoints'.
  endpoints: {
    group: 'prod',
    version: 1
  },
  // Constantes para cognito productivo.
  cognito: {
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
  }
};
