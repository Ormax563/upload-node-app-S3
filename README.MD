# Package to upload node app compilation to AWS S3
## Install
```
$ npm install --global upload-node-app-s3
```

## Usage CLI
```
$ upload-node-app-s3 --help

  Package to upload node app compilation to AWS S3

  Parameters
    --bucket (*):  url of bucket
    --key (*): AWS key,
    --secret-key (*): private AWS key,
    --folder (optional, default: /build): folder of app built,
    --policy (optional, default: false): attach necessary policy to S3 bucket,
    --hosting (optional, default: false): enable hosting static website in S3 bucket

```
## Example
```
upload-node-app-s3 --bucket=TESTBUCKET --key=TESTNGKEY --secret-key=TESTSECRETKEY --policy=true --hosting=true

```