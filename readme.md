# Payload CMS SDK + Plugin 

## SDK JS

### find()

### findOne()

### create()

### update()

### deleteOne()


## Plugin 

### Permission plugin

1- All slug contains `users` are allowed to use permission plugins and authentication execpt default payload users.

Ex: customer-users , public-users , doa-users

```js

import {pluginPermission} from "@wikoci/payloadjs"

//payload.config.js
plugins:[
    pluginPermission
]

```

