
function isBrowser() {
    
    try {
      return  window? true :false
    } catch (err) {
        return false
    }
}

function setConfigPermission(config = {
    defaultPermission:{},
})
{
    
    if (isBrowser()) {
        window.__configPermission__ = config;
    } else {
        global.__configPermission__ = config;
    }
}


function getConfigPermission() {

  

    if (isBrowser()) {
        if (!window.__configPermission__) setConfigPermission()
        return window.__configPermission__; 
    } else {
         if (!global.__configPermission__) setConfigPermission();
    return global.__configPermission__
  }
}


const setPermission = (incomingConfig) => {
const defaulPermissions = getConfigPermission().defaultPermissions || {
  slug: {
    auth: ["create", "readAny"], // default permissions for Auth User :  create | readAny | readOwn | deleteAny | deleteOwn | updateOwn | updateAny
    public: ["readAny"], // readAny | createAny | deleteAny | updateAny,
    readOnlyCreatedBy: true, // read
    readOnlyUpdatedBy: true, // read
  },
};
    

  console.log("Permission is loaded",defaulPermissions)
  var initCollections = [];
  var useCollections = incomingConfig.collections.filter(
    (e) => e.auth && e.slug !== "users" && e.slug.match(/(users)/)
  );
  var anotherCollections = incomingConfig.collections.filter(
    (e) => !e.auth && e.slug !== "users" && !e.slug.match(/(users)/)
  );
  // console.log("Use collections",useCollections)
  // collections.push()

  useCollections.map((collection) => {
    if (collection.slug.match(/(users)/)) {
      collection.fields = [
        ...collection.fields,
        {
          name: "permissions",
          type: "group",

          fields: anotherCollections.map((col) => {
            // console.log("PP",col)
            return {
              name: col.slug,
              type: "select",
              hasMany: true,

              admin: {
                isClearable: true,
              },
              options: [
                "create",
                "readOwn",
                "readAny",
                "updateOwn",
                "updateAny",
                "deleteOwn",
                "deleteAny",
              ],
               defaultValue: defaulPermissions[col.slug]?.auth || [],
            };
          }),
        },
      ];
    }

    // console.log("Col ", collection);
  });

  anotherCollections.map((collection) => {
    // fields link permissions to collection
    let by = useCollections.map((col) => col.slug) || [];
    by.push("users"); // admin users
    collection.fields = [
      ...collection.fields,
      {
        name: "createdBy",
        type: "relationship",
        relationTo: by,
        hasMany: false,
        admin: {
          readOnly: defaulPermissions[collection.slug]?.readOnlyCreatedBy
            ? defaulPermissions[collection.slug].readOnlyCreatedBy
            : true,
          position: "sidebar",
        },
      },
      {
        name: "updatedBy",
        type: "relationship",
        relationTo: by,
        hasMany: false,
        admin: {
          readOnly: defaulPermissions[collection.slug]?.readOnlyUpdatedBy
            ? defaulPermissions[collection.slug].readOnlyCreatedBy
            : true,
          position: "sidebar",
        },
      },
    ];

    // access
    collection.access = {
      read: async ({ req }) => {
        if (req.user && req.user.collection == "users") return true;
        if (req.user && req.user.permissions) {
          let permissionsString =
            req.user.permissions[collection.slug]?.toString() || "";
          console.log("Permission string", permissionsString);

          if (permissionsString.match(/(readOwn)/)) {
            console.log("Own is active", req.user.id);
            return {
              ...req.query.where,
              "createdBy.value": {
                equals: req.user.id,
              },
            };
          }
          //console.log("Query",req.query.where);
          if (permissionsString.match(/(readAny)/)) {
            return true;
          }
        } else {
          let exist =
            defaulPermissions[collection.slug]?.public.filter(
              (e) => e == "readAny"
            ) || [];
          return exist.length ? true : false;
        }
      },
      create: async ({ req, data }) => {
        if (req.user && data) {
          data.createdBy = {
            relationTo: req.user.collection,
            value: req.user.id,
          };
          data.updatedBy = {
            relationTo: req.user.collection,
            value: req.user.id,
          };
        }
        if (req.user && req.user.collection == "users") return true;
        if (req.user && req.user.permissions) {
          let permissionsString =
            req.user.permissions[collection.slug]?.toString() || "";

          if (permissionsString.match(/(create)/)) {
            return true;
          } else {
            return false;
          }
        } else {
          let exist =
            defaulPermissions[collection.slug]?.public.filter(
              (e) => e == "createAny"
            ) || [];
          return exist.length ? true : false;
        }
      },
      update: async ({ req, data, id }) => {
        if (req.user && data) {
          data.updatedBy = {
            relationTo: req.user.collection,
            value: req.user.id,
          };
        }
        if (req.user && req.user.collection == "users") return true;
        if (req.user && req.user.permissions) {
          let permissionsString =
            req.user.permissions[collection.slug]?.toString() || "";

          if (permissionsString.match(/(updateOwn)/)) {
            console.log("Own is active", req.user.id);
            return {
              ...req.query.where,
              "createdBy.value": {
                equals: req.user.id,
              },
            };
          }

          if (permissionsString.match(/(updateAny)/)) {
            return true;
          }
        } else {
          let exist =
            defaulPermissions[collection.slug]?.public.filter(
              (e) => e == "updateAny"
            ) || [];
          return exist.length ? true : false;
        }
      },
      delete: async ({ req, id }) => {
        if (req.user && req.user.collection == "users") return true;
        if (req.user && req.user.permissions) {
          let permissionsString =
            req.user.permissions[collection.slug]?.toString() || "";

          if (permissionsString.match(/(deleteOwn)/)) {
            console.log("Own is active", req.user.id);
            return {
              ...req.query.where,
              "createdBy.value": {
                equals: req.user.id,
              },
            };
          }

          if (permissionsString.match(/(deleteAny)/)) {
            return true;
          }
        } else {
          let exist =
            defaulPermissions[collection.slug]?.public.filter(
              (e) => e == "deleteAny"
            ) || [];
          return exist.length ? true : false;
        }
      },
      ...collection.access,
    };
  });


    
  const config = {
    ...incomingConfig,
  };

  return config;
};

module.exports = {
    setPermission,
    setConfigPermission
};
