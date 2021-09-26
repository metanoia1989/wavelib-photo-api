// @ts-check

import fs from 'fs'
import path from 'path'
import { config as globalConfig } from '@src/config';
import COS from 'cos-nodejs-sdk-v5';
import * as util from './helpers'

const config = globalConfig.ossConfig

const cos = new COS({
    // 必选参数
    SecretId: config.SecretId,
    SecretKey: config.SecretKey,
    // 可选参数
    FileParallelLimit: 3,    // 控制文件上传并发数
    ChunkParallelLimit: 8,   // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
    ChunkSize: 1024 * 1024 * 8,  // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
    Proxy: '',
    Protocol: 'https:',
    FollowRedirect: false,
});

var TaskId;

export function camSafeUrlEncode(str) {
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}

export function getAuth() {
    var key = '1mb.zip';
    var auth = cos.getAuth({
        Method: 'get',
        Key: key,
        Expires: 60,
    });
    // 注意：这里的 Bucket 格式是 test-1250000000
    console.log('https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com' + '/' + camSafeUrlEncode(key).replace(/%2F/g, '/') + '?sign=' + encodeURIComponent(auth));
}

export function getV4Auth() {
    console.log();
    var key = '中文.txt';
    var auth = cos.getV4Auth({
        Bucket: config.Bucket,
        Key: key,
        Expires: 60,
    });
    // 注意：这里的 Bucket 格式是 test-1250000000
    console.log('https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com' + '/' + camSafeUrlEncode(key).replace(/%2F/g, '/') + '?sign=' + encodeURIComponent(auth));
}

export function getObjectUrl() {
    var url = cos.getObjectUrl({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip',
        Expires: 60,
        Sign: true,
    }, function (err, data) {
        console.log(err || data);
    });
    console.log(url);
}

export function getService() {
    cos.getService({
      Region: 'ap-guangzhou',
    },function (err, data) {
        console.log(err || data);
    });
}

export function putBucket() {
    cos.putBucket({
        Bucket: 'testnew-' + config.Bucket.substr(config.Bucket.lastIndexOf('-') + 1),
        Region: 'ap-guangzhou',
        // BucketAZConfig: 'MAZ',
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucket() {
    cos.getBucket({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function headBucket() {
    cos.headBucket({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function deleteBucket() {
    cos.deleteBucket({
        Bucket: 'testnew-' + config.Bucket.substr(config.Bucket.lastIndexOf('-') + 1),
        Region: 'ap-guangzhou'
    }, function (err, data) {
        console.log(err || data);
    });
}

export function putBucketAcl() {
    cos.putBucketAcl({
        Bucket: config.Bucket,
        Region: config.Region,
        // GrantFullControl: 'id="qcs::cam::uin/1001:uin/1001",id="qcs::cam::uin/1002:uin/1002"',
        // GrantWrite: 'id="qcs::cam::uin/1001:uin/1001",id="qcs::cam::uin/1002:uin/1002"',
        // GrantRead: 'id="qcs::cam::uin/1001:uin/1001",id="qcs::cam::uin/1002:uin/1002"',
        // GrantReadAcp: 'id="qcs::cam::uin/1001:uin/1001",id="qcs::cam::uin/1002:uin/1002"',
        // GrantWriteAcp: 'id="qcs::cam::uin/1001:uin/1001",id="qcs::cam::uin/1002:uin/1002"',
        // ACL: 'public-read-write',
        // ACL: 'public-read',
        ACL: 'private',
        AccessControlPolicy: {
        "Owner": { // AccessControlPolicy 里必须有 owner
            "ID": 'qcs::cam::uin/10001:uin/10001' // 10001 是 Bucket 所属用户的 QQ 号
        },
        "Grants": [
            {
                "Grantee": {
                    "URI": "https://cam.qcloud.com/groups/global/AllUsers", // 允许匿名用户组访问
                },
                "Permission": "READ"
            },
            {
                "Grantee": {
                    "ID": "qcs::cam::uin/1001:uin/1001", // 10002 是 QQ 号
                },
                "Permission": "WRITE"
            },  {
                "Grantee": {
                    "ID": "qcs::cam::uin/10002:uin/10002", // 10002 是 QQ 号
                },
                "Permission": "READ_ACP"
            }, {
                "Grantee": {
                    "ID": "qcs::cam::uin/10002:uin/10002", // 10002 是 QQ 号
                },
                "Permission": "WRITE_ACP"
            }]
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketAcl() {
    cos.getBucketAcl({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function putBucketCors() {
    cos.putBucketCors({
        Bucket: config.Bucket,
        Region: config.Region,
        CORSRules: [{
            "AllowedOrigin": ["*"],
            "AllowedMethod": ["GET", "POST", "PUT", "DELETE", "HEAD"],
            "AllowedHeader": ["*"],
            "ExposeHeader": ["ETag", "Date", "Content-Length", "x-cos-acl", "x-cos-version-id", "x-cos-request-id", "x-cos-delete-marker", "x-cos-server-side-encryption"],
            "MaxAgeSeconds": 5
        }]
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketCors() {
    cos.getBucketCors({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function deleteBucketCors() {
    cos.deleteBucketCors({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function putBucketPolicy() {
    var AppId = config.Bucket.substr(config.Bucket.lastIndexOf('-') + 1);
    cos.putBucketPolicy({
        Policy: {
            "version": "2.0",
            "statement": [{
                "effect": "allow",
                "principal": {"qcs": ["qcs::cam::uin/10001:uin/10001"]}, // 这里的 10001 是 QQ 号
                "action": [
                    // 这里可以从临时密钥的权限上控制前端允许的操作
                    // 'name/cos:*', // 这样写可以包含下面所有权限

                    // // 列出所有允许的操作
                    // // ACL 读写
                    // 'name/cos:GetBucketACL',
                    // 'name/cos:PutBucketACL',
                    // 'name/cos:GetObjectACL',
                    // 'name/cos:PutObjectACL',
                    // // 简单 Bucket 操作
                    // 'name/cos:PutBucket',
                    // 'name/cos:HeadBucket',
                    // 'name/cos:GetBucket',
                    // 'name/cos:DeleteBucket',
                    // 'name/cos:GetBucketLocation',
                    // // Versioning
                    // 'name/cos:PutBucketVersioning',
                    // 'name/cos:GetBucketVersioning',
                    // // CORS
                    // 'name/cos:PutBucketCORS',
                    // 'name/cos:GetBucketCORS',
                    // 'name/cos:DeleteBucketCORS',
                    // // Lifecycle
                    // 'name/cos:PutBucketLifecycle',
                    // 'name/cos:GetBucketLifecycle',
                    // 'name/cos:DeleteBucketLifecycle',
                    // // Replication
                    // 'name/cos:PutBucketReplication',
                    // 'name/cos:GetBucketReplication',
                    // 'name/cos:DeleteBucketReplication',
                    // // 删除文件
                    // 'name/cos:DeleteMultipleObject',
                    // 'name/cos:DeleteObject',
                    // 简单文件操作
                    'name/cos:PutObject',
                    'name/cos:AppendObject',
                    'name/cos:GetObject',
                    'name/cos:HeadObject',
                    'name/cos:OptionsObject',
                    'name/cos:PutObjectCopy',
                    'name/cos:PostObjectRestore',
                    // 分片上传操作
                    'name/cos:InitiateMultipartUpload',
                    'name/cos:ListMultipartUploads',
                    'name/cos:ListParts',
                    'name/cos:UploadPart',
                    'name/cos:CompleteMultipartUpload',
                    'name/cos:AbortMultipartUpload',
                ],
                // "resource": ["qcs::cos:ap-guangzhou:uid/1250000000:test-1250000000/*"] // 1250000000 是 appid
                "resource": ["qcs::cos:" + config.Region + ":uid/" + AppId + ":" + config.Bucket + "/*"] // 1250000000 是 appid
            }]
        },
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketPolicy() {
    cos.getBucketPolicy({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function deleteBucketPolicy() {
    cos.deleteBucketPolicy({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketLocation() {
    cos.getBucketLocation({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function putBucketTagging() {
    cos.putBucketTagging({
        Bucket: config.Bucket,
        Region: config.Region,
        Tags: [
            {"Key": "k1", "Value": "v1"},
            {"Key": "k2", "Value": "v2"}
        ]
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketTagging() {
    cos.getBucketTagging({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function deleteBucketTagging() {
    cos.deleteBucketTagging({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function putBucketLifecycle() {
    cos.putBucketLifecycle({
        Bucket: config.Bucket,
        Region: config.Region,
        Rules: [{
            "ID": "1",
            "Status": "Enabled",
            "Filter": {},
            "Transition": {
                "Days": "30",
                "StorageClass": "STANDARD_IA"
            }
        }, {
            "ID": "2",
            "Status": "Enabled",
            "Filter": {
                "Prefix": "dir/"
            },
            "Transition": {
                "Days": "180",
                "StorageClass": "ARCHIVE"
            }
        }, {
            "ID": "3",
            "Status": "Enabled",
            "Filter": {},
            "Expiration": {
                "Days": "180"
            }
        }, {
            "ID": "4",
            "Status": "Enabled",
            "Filter": {},
            "AbortIncompleteMultipartUpload": {
                "DaysAfterInitiation": "30"
            }
        }],
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketLifecycle() {
    cos.getBucketLifecycle({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function deleteBucketLifecycle() {
    cos.deleteBucketLifecycle({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function putBucketVersioning() {
    cos.putBucketVersioning({
        Bucket: config.Bucket,
        Region: config.Region,
        VersioningConfiguration: {
            Status: "Enabled"
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketVersioning() {
    cos.getBucketVersioning({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function putBucketReplication() {
    var AppId = config.Bucket.substr(config.Bucket.lastIndexOf('-') + 1);
    cos.putBucketReplication({
        Bucket: config.Bucket,
        Region: config.Region,
        ReplicationConfiguration: {
            Role: "qcs::cam::uin/10001:uin/10001",
            Rules: [{
                ID: "1",
                Status: "Enabled",
                Prefix: "sync/",
                Destination: {
                    Bucket: "qcs:id/0:cos:ap-chengdu:appid/" + AppId + ":backup",
                    // StorageClass: "Standard",
                }
            }]
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketReplication() {
    cos.getBucketReplication({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function deleteBucketReplication() {
    cos.deleteBucketReplication({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function putBucketWebsite() {
    cos.putBucketWebsite({
        Bucket: config.Bucket,
        Region: config.Region,
        WebsiteConfiguration: {
            IndexDocument: {
                Suffix: "index.html" // 必选
            },
            RedirectAllRequestsTo: {
                Protocol: "https"
            },
            // ErrorDocument: {
            //     Key: "error.html"
            // },
            // RoutingRules: [{
            //     Condition: {
            //         HttpErrorCodeReturnedEquals: "404"
            //     },
            //     Redirect: {
            //         Protocol: "https",
            //         ReplaceKeyWith: "404.html"
            //     }
            // }, {
            //     Condition: {
            //         KeyPrefixEquals: "docs/"
            //     },
            //     Redirect: {
            //         Protocol: "https",
            //         ReplaceKeyPrefixWith: "documents/"
            //     }
            // }, {
            //     Condition: {
            //         KeyPrefixEquals: "img/"
            //     },
            //     Redirect: {
            //         Protocol: "https",
            //         ReplaceKeyWith: "picture.jpg"
            //     }
            // }]
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketWebsite() {
    cos.getBucketWebsite({
        Bucket: config.Bucket,
        Region: config.Region
    },function(err, data){
        console.log(err || data);
    });
}

export function deleteBucketWebsite() {
    cos.deleteBucketWebsite({
        Bucket: config.Bucket,
        Region: config.Region
    },function(err, data){
        console.log(err || data);
    });
}

export function putBucketReferer() {
    cos.putBucketReferer({
        Bucket: config.Bucket,
        Region: config.Region,
        RefererConfiguration: {
            Status: 'Enabled',
            RefererType: 'White-List',
            DomainList: {
                Domains: [
                    '*.qq.com',
                    '*.qcloud.com',
                ]
            },
            EmptyReferConfiguration: 'Allow',
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketReferer() {
    cos.getBucketReferer({
        Bucket: config.Bucket,
        Region: config.Region
    },function(err, data){
        console.log(err || JSON.stringify(data, null, '    '));
    });
}

export function putBucketDomain() {
    cos.putBucketDomain({
        Bucket: config.Bucket,
        Region: config.Region,
        DomainRule:[{
            Status: "DISABLED",
            Name: "www.testDomain1.com",
            Type: "REST"
        }, {
            Status: "DISABLED",
            Name: "www.testDomain2.com",
            Type: "WEBSITE"
        }]
    },function(err, data){
        console.log(err || data);
    });
}

export function getBucketDomain() {
    cos.getBucketDomain({
        Bucket: config.Bucket,
        Region: config.Region
    },function(err, data){
        console.log(err || data);
    });
}

export function deleteBucketDomain() {
    cos.deleteBucketDomain({
        Bucket: config.Bucket,
        Region: config.Region
    },function(err, data){
        console.log(err || data);
    });
}

export function putBucketOrigin() {
    cos.putBucketOrigin({
        Bucket: config.Bucket,
        Region: config.Region,
        OriginRule: [{
            OriginType: 'Mirror',
            OriginCondition: {HTTPStatusCode: 404, Prefix: ''},
            OriginParameter: {
                Protocol: 'HTTP',
                FollowQueryString: 'true',
                HttpHeader: {
                    NewHttpHeader: {
                        Header: [{
                            Key: 'a',
                            Value: 'a'
                        }]
                    }
                },
                FollowRedirection: 'true',
                HttpRedirectCode: ['301', '302']
            },
            OriginInfo: {
                HostInfo: {HostName: 'qq.com'},
                FileInfo: {
                    PrefixConfiguration: {Prefix: '123/'},
                    SuffixConfiguration: {Suffix: '.jpg'}
                }
            },
            RulePriority: 1
        }]
    },function(err, data){
        console.log(err || data);
    });
}

export function getBucketOrigin() {
    cos.getBucketOrigin({
        Bucket: config.Bucket,
        Region: config.Region,
    }, function(err, data){
        console.log(err || data);
    });
}

export function deleteBucketOrigin() {
    cos.deleteBucketOrigin({
        Bucket: config.Bucket,
        Region: config.Region,
    },function(err, data){
        console.log(err || data);
    });
}

export function putBucketLogging() {
    var AppId = config.Bucket.substr(config.Bucket.lastIndexOf('-') + 1);
    cos.putBucketLogging({
        Bucket: config.Bucket,
        Region: config.Region,
        BucketLoggingStatus: {
            LoggingEnabled: {
                TargetBucket: 'bucket-logging-' + AppId,
                TargetPrefix: 'logging'
            }
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketLogging() {
    cos.getBucketLogging({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

export function deleteBucketLogging() {
    cos.putBucketLogging({
        Bucket: config.Bucket,
        Region: config.Region,
        BucketLoggingStatus: {
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

export function putBucketInventory() {
    var AppId = config.Bucket.substr(config.Bucket.lastIndexOf('-') + 1);
    cos.putBucketInventory({
        Bucket: config.Bucket,
        Region: config.Region,
        Id: 'inventory_test',
        InventoryConfiguration: {
            Id: 'inventory_test',
            IsEnabled: 'true',
            Destination: {
                COSBucketDestination: {
                    Format: 'CSV',
                    AccountId: config.Uin,
                    Bucket: 'qcs::cos:ap-guangzhou::bucket-logging-' + AppId,
                    Prefix: 'inventory',
                    Encryption: {
                        SSECOS: ''
                    }
                }
            },
            Schedule: {
                Frequency: 'Daily'
            },
            Filter: {
                Prefix: 'myPrefix'
            },
            IncludedObjectVersions: 'All',
            OptionalFields: [
                'Size',
                'LastModifiedDate',
                'ETag',
                'StorageClass',
                'IsMultipartUploaded',
                'ReplicationStatus'
            ]
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketInventory() {
    cos.getBucketInventory({
        Bucket: config.Bucket,
        Region: config.Region,
        Id: 'inventory_test'
    }, function(err, data) {
        console.log(err || JSON.stringify(data));
    });
}

export function deleteBucketInventory() {
    cos.deleteBucketInventory({
        Bucket: config.Bucket,
        Region: config.Region,
        Id: 'inventory_test'
    }, function(err, data) {
        console.log(err || JSON.stringify(data));
    });
}

export function listBucketInventory() {
    cos.listBucketInventory({
        Bucket: config.Bucket,
        Region: config.Region
    }, function(err, data) {
        console.log(err || JSON.stringify(data));
    });
}

export function putBucketAccelerate() {
    cos.putBucketAccelerate({
        Bucket: config.Bucket,
        Region: config.Region,
        AccelerateConfiguration: {
            Status: 'Enabled'
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getBucketAccelerate() {
    cos.getBucketAccelerate({
        Bucket: config.Bucket,
        Region: config.Region,
    }, function(err, data) {
        console.log(err || data);
    });
}

export function putBucketEncryption() {
    cos.putBucketEncryption({
        Bucket: config.Bucket,
        Region: config.Region,
        ServerSideEncryptionConfiguration: {
            Rule: [{
                ApplySideEncryptionConfiguration: {
                    SSEAlgorithm: 'AES256',
                },
            }],
        },
    }, function(err, data) {
        console.log(JSON.stringify(err || data, null, 2));
    });
}

export function getBucketEncryption() {
    cos.getBucketEncryption({
        Bucket: config.Bucket,
        Region: config.Region
    }, function(err, data) {
        console.log(err || JSON.stringify(data));
    });
}

export function deleteBucketEncryption() {
    cos.deleteBucketEncryption({
        Bucket: config.Bucket,
        Region: config.Region
    }, function(err, data) {
        console.log(err || JSON.stringify(data));
    });
}

export function putObject() {
    // 创建测试文件
    var filename = '1mb.zip';
    var filepath = path.resolve(__dirname, filename);
    util.createFile(filepath, 1024 * 1024, function (err) {
      // 调用方法
      cos.putObject({
          Bucket: config.Bucket, /* 必须 */
          Region: config.Region,
          Key: filename, /* 必须 */
          onTaskReady: function (tid) {
              TaskId = tid;
          },
          onProgress: function (progressData) {
              console.log(JSON.stringify(progressData));
          },
          // 格式1. 传入文件内容
          // Body: fs.readFileSync(filepath),
          // 格式2. 传入文件流，必须需要传文件大小
          Body: fs.createReadStream(filepath),
          ContentLength: fs.statSync(filepath).size,
          Headers: {
              // 万象持久化接口，上传时持久化
              // 'Pic-Operations': '{"is_pic_info": 1, "rules": [{"fileid": "test.jpg", "rule": "imageMogr2/thumbnail/!50p"}]}'
          },
      }, function (err, data) {
          console.log(err || data);
          fs.unlinkSync(filepath);
      });
  });
}

export function putObject_base64ToBuffer() {
  // 创建测试文件
  var filename = 'test.png';
  var filepath = path.resolve(__dirname, filename);
  var base64Url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABRFBMVEUAAAAAo/8Ao/8Ao/8Ao/8ApP8Aov8Ao/8Abv8Abv8AyNwAyNwAo/8Ao/8Ao/8Abv8Ao/8AivgAo/8AyNwAbv8Abv8AydwApf8Abf8Ao/8AbP8Ao/8AyNwAydwAbv8AydwApP8Ao/8AyNwAo/8AyNwAydsAyNwAxd8Aov8AyNwAytsAo/8Abv8AyNwAbv8Av+MAo/8AytsAo/8Abv8AyNwAo/8Abv8AqfkAbv8Aov8Abv8AyNwAov8Abv8Ao/8Abv8Ao/8AydwAo/8Ao/8Ate8Ay9oAvOcAof8AveAAyNwAyNwAo/8AyNwAy9kAo/8AyNwAyNwAo/8AqP8Aaf8AyNwAbv0Abv8Abv8AaP8Ao/8Ao/8Ao/8Ao/8Abv8AyNwAgvcAaP8A0dkAo/8AyNwAav8Abv8Ao/8Abv8AyNwAy9sAvOUAtePdkYxjAAAAZnRSTlMAw/co8uAuJAn8+/Tt29R8DAX77+nZz87Jv6CTh3lxTklAPjouJRsL5tjAuLiyr62roaCakYp0XVtOQTMyLiohICAcGRP49vTv5+PJurawq6mnnJuYl4+OiIB7eXVvX15QSDgqHxNcw3l6AAABe0lEQVQ4y82P11oCQQxGIy5FUJpKk6aAhV6k92LvvXedDfj+92ZkYQHxnnMxu3/OfJMEJo6y++baXf5XVw22GVGcsRmq431mQZRYyIzRGgdXi+HwIv86NDBKisrRAtU1hSj9pkZ9jpo/9YKbRsmNNKCHDXI00BxfMMirKNpMcjQ5Lm4/YZArUXyBYUwg40nsdr5jb3LBe25VWpNeKa1GENsEnq52C80z1uW48estiKjb19G54QdCrScnKAU69U3KJ4jzrsBawDWPuOcBqMyRvlcb1Y+zjMUBVsivAKe4gXgEKiVjSh9wlunGMmwiOqFL3RI0cj+nkgp3jC1BELVFkGiZSuvkp3tZZWZ2sKCuDj185PXqfmwI7AAOUctHkJoOeXg3sxA4ES+l7CVvrYHMEmNp8GtR+wycPG0+1RrwWQUzl4CvgQmPP5Ddofl8tWkJVT7J+BIAaxEktrYZoRAUfXgOGYHfcOqw3WF/EdLccz5cMfvUCPb4QwUmhB8+v12HZPCkbgAAAABJRU5ErkJggg==';
  var body = Buffer.from(base64Url.split(',')[1] , 'base64');
  util.createFile(filepath, 1024 * 1024, function (err) {
    // 调用方法
    cos.putObject({
        Bucket: config.Bucket, /* 必须 */
        Region: config.Region,
        Key: filename, /* 必须 */
        onTaskReady: function (tid) {
            TaskId = tid;
        },
        onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
        },
        // 格式1. 传入文件内容
        // Body: fs.readFileSync(filepath),
        // 格式2. 传入文件流，必须需要传文件大小
        Body: body,
        ContentLength: body.length,
        Headers: {
            // 万象持久化接口，上传时持久化
            // 'Pic-Operations': '{"is_pic_info": 1, "rules": [{"fileid": "test.jpg", "rule": "imageMogr2/thumbnail/!50p"}]}'
        },
    }, function (err, data) {
        console.log(err || data);
        fs.unlinkSync(filepath);
    });
});
}

export function putObjectCopy() {
    cos.putObjectCopy({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.copy.zip',
        CopySource: config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + camSafeUrlEncode('1mb.zip').replace(/%2F/g, '/'),
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getObject() {
    var filepath1 = path.resolve(__dirname, '1mb.out1.zip');
    var filepath2 = path.resolve(__dirname, '1mb.out2.zip');
    var filepath3 = path.resolve(__dirname, '1mb.out3.zip');

    // file1 获取对象字节到内存变量
    cos.getObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip',
        onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
        }
    }, function (err, data) {
        if(data){
          fs.writeFileSync(filepath1, data.Body);
        } else {
          console.log(err);
        }
    });

}

export function headObject() {
    cos.headObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip'
    }, function (err, data) {
        console.log(err || data);
    });
}

export function listObjectVersions() {
    cos.listObjectVersions({
        Bucket: config.Bucket,
        Region: config.Region,
        // Prefix: "",
        // Delimiter: '/'
    }, function (err, data) {
        console.log(err || JSON.stringify(data, null, '    '));
    });
}

export function putObjectAcl() {
    cos.putObjectAcl({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip',
        // GrantFullControl: 'id="qcs::cam::uin/1001:uin/1001",id="qcs::cam::uin/1002:uin/1002"',
        // GrantWriteAcp: 'id="qcs::cam::uin/1001:uin/1001",id="qcs::cam::uin/1002:uin/1002"',
        // GrantReadAcp: 'id="qcs::cam::uin/1001:uin/1001",id="qcs::cam::uin/1002:uin/1002"',
        // GrantRead: 'id="qcs::cam::uin/1001:uin/1001",id="qcs::cam::uin/1002:uin/1002"',
        // ACL: 'public-read-write',
        // ACL: 'public-read',
        // ACL: 'private',
        ACL: 'default', // 继承上一级目录权限
        // AccessControlPolicy: {
        //     "Owner": { // AccessControlPolicy 里必须有 owner
        //         "ID": 'qcs::cam::uin/459000000:uin/459000000' // 459000000 是 Bucket 所属用户的 QQ 号
        //     },
        //     "Grants": [{
        //         "Grantee": {
        //             "ID": "qcs::cam::uin/10002:uin/10002", // 10002 是 QQ 号
        //         },
        //         "Permission": "READ"
        //     }]
        // }
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getObjectAcl() {
    cos.getObjectAcl({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip'
    }, function (err, data) {
        console.log(err || data);
    });
}

export function deleteObject() {
    cos.deleteObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip'
    }, function (err, data) {
        console.log(err || data);
    });
}

export function deleteMultipleObject() {
    cos.deleteMultipleObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Objects: [
            {Key: '中文/中文.txt'},
            {Key: '中文/中文.zip',VersionId: 'MTg0NDY3NDI1MzM4NzM0ODA2MTI'},
        ]
    }, function (err, data) {
        console.log(err || data);
    });
}

export function restoreObject() {
    cos.restoreObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1.txt',
        RestoreRequest: {
            Days: 1,
            CASJobParameters: {
                Tier: 'Expedited'
            }
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

var selectCsvOpt = {
    Bucket: config.Bucket,
    Region: config.Region,
    Key: '1.csv',
    SelectType: 2,
    SelectRequest: {
        // Expression: "select * from cosobject s limit 100",
        Expression: "Select * from COSObject",
        ExpressionType: "SQL",
        InputSerialization: {
            CSV: {
                FileHeaderInfo: "IGNORE",
                RecordDelimiter: "\\n",
                FieldDelimiter: ",",
                QuoteCharacter: "\"",
                QuoteEscapeCharacter: "\"",
                Comments: "#",
                AllowQuotedRecordDelimiter: "FALSE"
            }
        },
        OutputSerialization: {
            CSV: {
                QuoteFields: "ASNEEDED",
                RecordDelimiter: "\\n",
                FieldDelimiter: ",",
                QuoteCharacter: "\"",
                QuoteEscapeCharacter: "\""
            }
        },
        RequestProgress: {Enabled: "FALSE"}
    },
};

var selectJsonOpt = {
    Bucket: config.Bucket,
    Region: config.Region,
    Key: '1.json',
    SelectType: 2,
    SelectRequest: {
        Expression: "Select * from COSObject",
        ExpressionType: "SQL",
        InputSerialization: {JSON: {Type: "DOCUMENT"}},
        OutputSerialization: {JSON: {RecordDelimiter: "\n"}},
        RequestProgress: {Enabled: "FALSE"}
    },
};

export function selectObjectContentStream() {
    // 查询 JSON
    var opt = Object.assign({
        // DataType: 'raw',
    }, selectJsonOpt);
    var selectStream = cos.selectObjectContentStream(opt, function (err, data) {
        console.log(err || data);
    });
    var outFile = './result.txt';
    selectStream.pipe(fs.createWriteStream(outFile));
    selectStream.on('end', () => console.log(fs.readFileSync(outFile).toString()))
}

export function selectObjectContent() {
    // // 如果返回结果很大，可以用 selectObjectContentStream 处理
    // // 查询 CSV
    // cos.selectObjectContent(selectCsvOpt, function (err, data) {
    //     console.log(err || data);
    // });

    // 查询 JSON
    cos.selectObjectContent(selectJsonOpt, function (err, data) {
        console.log(err || data);
    });
}

export function multipartList() {
    cos.multipartList({
        Bucket: config.Bucket,
        Region: config.Region,
        Prefix: '',
        MaxUploads: 1,
        Delimiter: '/'
    }, function (err, data) {
        console.log(err || JSON.stringify(data, null, 2));
    });
}

export function multipartListPart() {
    cos.multipartListPart({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: "10mb.zip",
        MaxParts: 1,
        UploadId: 'xxx',
    }, function (err, data) {
        console.log(err || JSON.stringify(data, null, 2));
    });
}

export function multipartInit() {
    cos.multipartInit({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: "10mb.zip",
    }, function (err, data) {
        console.log(err || JSON.stringify(data, null, 2));
    });
}

export function multipartUpload() {
    cos.multipartUpload({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: "10mb.zip",
        UploadId: 'xxx',
        PartNumber: 1,
        Body: '123',
    }, function (err, data) {
        console.log(err || JSON.stringify(data, null, 2));
    });
}

export function multipartCom() {
    cos.multipartComplete({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1.zip',
        UploadId: 'xxx',
        Parts: [{
            PartNumber: 1,
            ETag: 'xxx',
        }],
    }, function (err, data) {
        console.log(err || JSON.stringify(data, null, 2));
    });
}

export function multipartAbort() {
    cos.multipartAbort({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: "10mb.zip",
        UploadId: 'xxx',
    }, function (err, data) {
        console.log(err || JSON.stringify(data, null, 2));
    });
}

export function abortUploadTask() {
    cos.abortUploadTask({
        Bucket: config.Bucket, /* 必须 */
        Region: config.Region, /* 必须 */
        // 格式1，删除单个上传任务
        // Level: 'task',
        // Key: '10mb.zip',
        // UploadId: '14985543913e4e2642e31db217b9a1a3d9b3cd6cf62abfda23372c8d36ffa38585492681e3',
        // 格式2，删除单个文件所有未完成上传任务
        Level: 'file',
        Key: '10mb.zip',
        // 格式3，删除 Bucket 下所有未完成上传任务
        // Level: 'bucket',
    }, function (err, data) {
        console.log(err || data);
    });
}

export function sliceUploadFile() {
    // 创建测试文件
    var filename = '10mb.zip';
    var filepath = path.resolve(__dirname, filename);
    util.createFile(filepath, 1024 * 1024 * 10, function (err) {
        // 调用方法
        cos.sliceUploadFile({
            Bucket: config.Bucket, /* 必须 */
            Region: config.Region,
            Key: filename, /* 必须 */
            FilePath: filepath, /* 必须 */
            onTaskReady: function (tid) {
                TaskId = tid;
            },
            onHashProgress: function (progressData) {
                console.log(JSON.stringify(progressData));
            },
            onProgress: function (progressData) {
                console.log(JSON.stringify(progressData));
            },
            Headers: {
                // 万象持久化接口，上传时持久化
                // 'Pic-Operations': '{"is_pic_info": 1, "rules": [{"fileid": "test.jpg", "rule": "imageMogr2/thumbnail/!50p"}]}'
            },
        }, function (err, data) {
            console.log(err || data);
            fs.unlinkSync(filepath);
        });
    });
}

export function cancelTask() {
    cos.cancelTask(TaskId);
    console.log('canceled');
}

export function pauseTask() {
    cos.pauseTask(TaskId);
    console.log('paused');
}

export function restartTask() {
    cos.restartTask(TaskId);
    console.log('restart');
}

export function uploadFile() {
  var filename = '3mb.zip';
  var filepath = path.resolve(__dirname, filename);
  util.createFile(filepath, 1024 * 1024 * 3, function (err) {
      cos.uploadFile({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: filename,
          FilePath: filepath,
          SliceSize: 1024 * 1024 * 5, // 大于5mb才进行分块上传
          onProgress: function (info) {
              var percent = Math.floor(info.percent * 10000) / 100;
              var speed = Math.floor(info.speed / 1024 / 1024 * 100) / 100;
              console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
          },
      }, function (err, data) {
          console.log('上传' + (err ? '失败' : '完成'));
          console.log(err || data);
          fs.unlinkSync(filepath);
      });
  });
}

export function uploadFiles() {
    var filepath = path.resolve(__dirname, '1mb.zip');
    util.createFile(filepath, 1024 * 1024 * 10, function (err) {
        var filename = 'mb.zip';
        cos.uploadFiles({
            files: [{
                Bucket: config.Bucket,
                Region: config.Region,
                Key: '1' + filename,
                FilePath: filepath,
            }, {
                Bucket: config.Bucket,
                Region: config.Region,
                Key: '2' + filename,
                FilePath: filepath,
            // }, {
            //     Bucket: config.Bucket,
            //     Region: config.Region,
            //     Key: '3' + filename,
            //     FilePath: filepath,
            }],
            SliceSize: 1024 * 1024,
            onProgress: function (info) {
                var percent = Math.floor(info.percent * 10000) / 100;
                var speed = Math.floor(info.speed / 1024 / 1024 * 100) / 100;
                console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
            },
            onFileFinish: function (err, data) {
                console.log(' 上传' + (err ? '失败' : '完成'), data);
            },
        }, function (err, data) {
            console.log(err || data);
            fs.unlinkSync(filepath);
        });
    });
}

export function sliceCopyFile() {
    // 创建测试文件
    var sourceName = '3mb.zip';
    var Key = '3mb.copy.zip';

    var sourcePath = config.Bucket + '.cos.' + config.Region + '.myqcloud.com/'+ camSafeUrlEncode(sourceName).replace(/%2F/g, '/');

    cos.sliceCopyFile({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: Key,
        CopySource: sourcePath,
        CopySliceSize: 2 * 1024 * 1024, // 大于2M的文件用分片复制，小于则用单片复制
        onProgress: function (info) {
            var percent = Math.floor(info.percent * 10000) / 100;
            var speed = Math.floor(info.speed / 1024 / 1024 * 100) / 100;
            console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
        }
    },function (err,data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
}

export function putObjectTagging() {
    cos.putObjectTagging({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip',
        Tags: [
            {Key: 'k1', Value: 'v1'},
            {Key: 'k2', Value: 'v2'},
        ],
    }, function (err, data) {
        console.log(err || data);
    });
}

export function getObjectTagging() {
    cos.getObjectTagging({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip',
    }, function (err, data) {
        console.log(err || data);
    });
}

export function deleteObjectTagging() {
    cos.getObjectTagging({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip',
    }, function (err, data) {
        console.log(err || data);
    });
}

/* 移动对象*/
export function moveObject() {
    // COS 没有对象重命名或移动的接口，移动对象可以通过复制/删除对象实现
    var source = 'source.txt';
    var target = 'target.txt';
    var copySource = config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + camSafeUrlEncode(source).replace(/%2F/g, '/');
    cos.putObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: source,
        Body: 'hello!',
    }, function (err, data) {
        if (err) return console.log(err);
        cos.putObjectCopy({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: target,
            CopySource: copySource,
        }, function (err, data) {
            if (err) return console.log(err);
            cos.deleteObject({
                Bucket: config.Bucket,
                Region: config.Region,
                Key: source,
            }, function (err, data) {
                console.log(err || data);
            });
        });
    });
}


export function request() {
    // 对云上数据进行图片处理
    var filename = 'example_photo.png';
    cos.request({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: filename,
        Method: 'POST',
        Action: 'image_process',
        Headers: {
            // 万象持久化接口，上传时持久化
            'Pic-Operations': '{"is_pic_info": 1, "rules": [{"fileid": "example_photo_ci_result.png", "rule": "imageMogr2/thumbnail/200x/"}]}'
        },
    }, function (err, data) {
        console.log(err || data);
    });
}

/**
 * function CIExample1
 * @description 上传时使用图片处理
 */
export function CIExample1(){
    var filename = 'example_photo.png'
    var filepath = path.resolve(__dirname, filename);
    cos.putObject({
        Bucket: config.Bucket, // Bucket 格式：test-1250000000
        Region: config.Region,
        Key: filename,
        Body: fs.readFileSync(filepath),
        Headers: {
            // 通过 imageMogr2 接口使用图片缩放功能：指定图片宽度为 100，宽度等比压缩
            'Pic-Operations':
            '{"is_pic_info": 1, "rules": [{"fileid": "example_photo_ci_result.png", "rule": "imageMogr2/thumbnail/200x/"}]}',
        },
        onTaskReady: function (tid) {
            TaskId = tid;
        },
        onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
        },
    }, function (err, data) {
        console.log(err || data);
    });
}

/**
 * function CIExample2
 * @description 对云上数据进行图片处理
 */
export function CIExample2(){
    var filename = 'example_photo.png';
    cos.request({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: filename,
        Method: 'POST',
        Action: 'image_process',
        Headers: {
        // 通过 imageMogr2 接口使用图片缩放功能：指定图片宽度为 200，宽度等比压缩
            'Pic-Operations': '{"is_pic_info": 1, "rules": [{"fileid": "example_photo_ci_result.png", "rule": "imageMogr2/thumbnail/200x/"}]}'
        },
    }, function (err, data) {
        console.log(err || data);
    });
}

/**
 * function CIExample3
 * @description 下载时使用图片处理
 */
export function CIExample3(){
    var filepath = path.resolve(__dirname, 'example_photo_ci_result.png');
    cos.getObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: 'example_photo.png',
            QueryString: `imageMogr2/thumbnail/200x/`,
        },
        function (err, data) {
            if(data){
              fs.writeFileSync(filepath, data.Body);
            } else {
              console.log(err);
            }
        },
    );
}

/**
 * function CIExample4
 * @description 生成带图片处理参数的签名 URL
 */
export function CIExample4(){

    // 生成带图片处理参数的文件签名URL，过期时间设置为 30 分钟。
    cos.getObjectUrl({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: 'photo.png',
            QueryString: `imageMogr2/thumbnail/200x/`,
            Expires: 1800,
            Sign: true,
        },
        function (err, data) {
            console.log(err || data);
        },
    );

    // 生成带图片处理参数的文件URL，不带签名。
    cos.getObjectUrl({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: 'photo.png',
            QueryString: `imageMogr2/thumbnail/200x/`,
            Sign: false,
        },
        function (err, data) {
            console.log(err || data);
        },
    );
}
