import defaulPermissions from "./permission.config";

const setPermission = (incomingConfig) => {
  //console.log("Permission is loaded",defaulPermissions)
  var initCollections = [];
  var useCollections = incomingConfig.collections.filter(
    (e) => e.auth && e.slug !== "users" && e.slug.match(/(users)/)
  );
  var anotherCollections = incomingConfig.collections.filter(
    (e) => !e.auth && e.slug !== "users" && !e.slug.match(/(users)/)
  );
  // console.log("Use collections",useCollections)
  // collections.push()

  console.log("Colle", useCollections);

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
              defaultValue: defaulPermissions[col.slug]?.authActions || [],
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
          readOnly: true,
          position: "sidebar",
        },
      },
      {
        name: "updatedBy",
        type: "relationship",
        relationTo: by,
        hasMany: false,
        admin: {
          readOnly: true,
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
            defaulPermissions[collection.slug].publicActions.filter(
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
            defaulPermissions[collection.slug].publicActions.filter(
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
            defaulPermissions[collection.slug].publicActions.filter(
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
            defaulPermissions[collection.slug].publicActions.filter(
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

export { setPermission };
