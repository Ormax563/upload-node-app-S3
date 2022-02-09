#!/usr/bin/env node
import meow from 'meow'
import {recursiveUpload,attachPolicy,enableHosting} from './index.js'
const cli = meow(`
	Parameters
	  --bucket (*):  url of bucket
	  --key (*): AWS key,
	  --secret-key (*): private AWS key,
	  --folder (optional, default: /build): folder of app built,
	  --policy (optional, default: false): attach necessary policy to S3 bucket,
	  --hosting (optional, default: false): enable hosting static website in S3 bucket
`, {
	importMeta: import.meta,
	booleanDefault: undefined,
	flags: {
		key: {
			type: 'string',
			isRequired: true
        },
        secretKey: {
            type: 'string',
			isRequired: true
        },
        bucket: {
            type: 'string',
			isRequired: true
        },
        folder: {
            type: 'string',
            default: './build'
		},
		policy: {
			type: 'boolean',
			default: false
		},
		hosting: {
			type: 'boolean',
			default: false
		}
	}
});


recursiveUpload(cli.flags.key, cli.flags.secretKey, cli.flags.bucket, cli.flags.folder).then(()=>{
	console.log("Project upload succesfully");
}).catch((err)=>{
	console.log(err);
});

if(cli.flags.policy){
	attachPolicy(cli.flags.key, cli.flags.secretKey, cli.flags.bucket).then((res)=>{
		
		console.log(res);
		
	}).catch((err)=>{
		console.log("ERROR attaching policy");
		console.log(err);
	});
}

if(cli.flags.hosting){
	enableHosting(cli.flags.key, cli.flags.secretKey, cli.flags.bucket).then((res)=>{
		
		console.log(res);
		
	}).catch((err)=>{
		console.log("ERROR attaching policy");
		console.log(err);
	});
}