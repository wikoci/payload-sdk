

![](https://payloadcms.com/_next/image?url=https%3A%2F%2Fpayloadcms.com%2Fimages%2Fblog%2Fv1%2Fv1-announced.jpg&w=1920&q=75)

# Payload CMS SDK + Plugin 

## Features
- Restful Method
- Plugin Permission 

### Installation 

```js
npm i @wikoci/payloadjs
yarn @wikoci/payloadjs
```

## SDK JS 

```js
import {Payload} from "@wikoci/payloadjs"

var payload =new Payload({
    key:'',
    apiURL:'',
    mediaURL:'',
    debug:true
})

```

### find()
```js
payload.find("slug",params,options);
```

### findOne()
```js
payload.findOne("slug",ID);
```

### create()
```js
payload.find("slug",data,options);
```
### update()
```js
payload.find("slug",ID,data,options);
```
### deleteOne()
```js
payload.find("slug",ID);
```
### raw() Comming soon....
```js
payload.raw(pipeline);
```

### aggregate() Comming soon....
```js
payload.aggregate("slug",pipeline);
```

## Plugin 

### Permission plugin

This plugin active all feature : createdBy , updatedBy , and Permission utility.

** Notice: **

1- All slug contains `users` are allowed to use permission plugins and authentication execpt default payload users.

Ex: customer-users , public-users , doa-users

```js

//payload.config.js

import {setPermission ,setConfigPermission} from "@wikoci/payloadjs/plugin/permission"

const config ={
    defaultPermission:{
    slug: {
        auth: ["create", "readAny"], // default permissions for Auth User :  create | readAny | readOwn | deleteAny | deleteOwn | updateOwn | updateAny
        public: ["readAny"],  // No auth user readAny | createAny | deleteAny | updateAny,
        readOnlyCreatedBy: true, // Admin UI
        readOnlyUpdatedBy: true, // Admin UI
  },
}
}

setConfigPermission(config) // Load permissions config before init plugin

plugins:[
    setPermission
]

```

