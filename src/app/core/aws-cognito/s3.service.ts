import { environment } from '@env/environment';

import * as S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk/global';
import { CognitoUtil } from './cognito.service';

import { Logger } from '../util/logger.service';

const log = new Logger('S3Service');

// Constantes de cognito
const cognitoEnv = environment.cognito;

/**
 * Created by Vladimir Budilov
 */
export class S3Service {

  constructor(public cognitoUtil: CognitoUtil) {

  }

  private getS3(): any {
    AWS.config.update({
      region: cognitoEnv.bucketRegion,
    });

    const clientParams: any = {
      region: cognitoEnv.bucketRegion,
      apiVersion: '2006-03-01',
      params: { Bucket: cognitoEnv.rekognitionBucket }
    };
    if (cognitoEnv.s3_endpoint) {
      clientParams.endpoint = cognitoEnv.s3_endpoint;
    }
    const s3 = new S3(clientParams);

    return s3;
  }

  public addPhoto(selectedFile: any): boolean {
    if (!selectedFile) {
      log.error('Please choose a file to upload first.');
      return;
    }
    const fileName = selectedFile.name;
    const albumPhotosKey = cognitoEnv.albumName + '/' + this.cognitoUtil.getCognitoIdentity() + '/';
    const photoKey = albumPhotosKey + fileName;

    this.getS3().upload({
      Key: photoKey,
      ContentType: selectedFile.type,
      Body: selectedFile,
      StorageClass: 'STANDARD',
      ACL: 'private'
    }, function (err: any, data: any) {
      if (err) {
        log.error('There was an error uploading your photo: ', err);
        return false;
      }
      log.debug('Successfully uploaded photo.');
      return true;
    });
  }

  public deletePhoto(albumName: any, photoKey: any) {
    // this.getS3().deleteObjectStore("").promise().then(function () {
    //
    // }
    this.getS3().deleteObject({ Key: photoKey }, function (err: any, data: any) {
      if (err) {
        log.error('There was an error deleting your photo: ', err.message);
        return;
      }
      log.debug('Successfully deleted photo.');
    });
  }

  public viewAlbum(albumName: any) {
    const albumPhotosKey = encodeURIComponent(cognitoEnv.albumName) + '//';
    this.getS3().listObjects({ Prefix: albumPhotosKey }, function (err: any, data: any) {
      if (err) {
        log.error('There was an error viewing your album: ' + err);
      }

    });
  }

}
