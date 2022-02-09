'use strict';
import S3 from 'aws-sdk/clients/s3.js';
import fs from 'fs';
import mime from 'mime';

/**
 * Upload an entire directory to an S3 bucket
 * @param {*} accessKeyId AWS access key
 * @param {*} secretAccessKey AWS Access Key ID
 * @param {*} bucket Name of the bucket
 * @param {*} buildPath Directory to upload to S3
 * @param prefix Updated path prefix on every recursion to upload subdirectories
 */
export const recursiveUpload = (accessKeyId, secretAccessKey,bucket, buildPath, prefix = '') => {
	
	const s3 = new S3({
		accessKeyId: accessKeyId,
    	secretAccessKey: secretAccessKey
	});
	return new Promise((resolve, reject) =>{
		fs.readdir(buildPath, (err, files) => {
			if(err) reject(Error(err));
			files.forEach(file => {
				if(!fs.lstatSync(buildPath + '/'+file).isDirectory()){
					fs.readFile(buildPath+ '/'+file, (err, data) => {
						if (err) reject(Error(err));
						
						const params = {
							Bucket: bucket,
							Key: prefix + file,
							Body: data,
							ContentType: mime.getType(buildPath+ '/'+file)
						}
						
						s3.upload(params).promise().then((data)=>{
							
							resolve(data);
						}).catch((err)=>{
							reject(Error(err))
						});
					});
				}else{
					recursiveUpload(accessKeyId, secretAccessKey, bucket, buildPath + '/'+file, prefix+file+'/');
				}
			})
	});
	
	})
	
}
/**
 * Attach Get policy to S3 bucket
 * @param {*} accessKeyId AWS access key
 * @param {*} secretAccessKey AWS Access Key ID
 * @param {*} bucket Name of the bucket
 */
export const attachPolicy = (accessKeyId, secretAccessKey,bucket) => {
	const s3 = new S3({
		accessKeyId: accessKeyId,
    	secretAccessKey: secretAccessKey
	});
	return new Promise((resolve, reject)=>{
		let params = {
			Bucket: bucket, 
			Policy: JSON.stringify({
				
				Version: "2012-10-17",
				Statement: [
					{
						"Sid": "AddPerm",
						"Effect": "Allow",
						"Principal": "*",
						"Action": "s3:GetObject",
						"Resource": "arn:aws:s3:::"+bucket+"/*"
					}
				]
			})
		}

		s3.putBucketPolicy(params, function(err, data) {
			if (err){
				reject(Error(err));
			}else{
				resolve("Policy attached successfully");
			}
		  });
	})

}

/**
 * Enable hosting static websites in S3 bucket
 * @param {*} accessKeyId AWS access key
 * @param {*} secretAccessKey AWS Access Key ID
 * @param {*} bucket Name of the bucket
 */
export const enableHosting = (accessKeyId, secretAccessKey,bucket) => {
	const s3 = new S3({
		accessKeyId: accessKeyId,
    	secretAccessKey: secretAccessKey
	});
	var params = {
		Bucket: bucket, 
		ContentMD5: "", 
		WebsiteConfiguration: {
		 IndexDocument: {
		  Suffix: "index.html"
		 }
		}
	   };
	
	   return new Promise((resolve, reject)=>{
			s3.putBucketWebsite(params, function(err, data) {
				if (err) reject(Error(err)) // an error occurred
				else resolve("Hosting enabled successfully")           // successful response
			});
	   });
}