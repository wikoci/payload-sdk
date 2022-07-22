const fs = require('fs');
const path = "../../../plugins/";
const file ="permission.config.js"
fs.access(path, (error) => {
  // To check if the given directory
  // already exists or not
  if (error) {
    // If current directory does not exist
    // then create it
    fs.mkdir(path, (error) => {
      if (error) {
        console.log(error);
      } else {
          console.log("New Plugins Directory created successfully !!");
          
      }
    });
  } else {
    
  }
    var buff = `
    //Config for default Permissions 
    // Array of default permissions .
    // *** Public Permission hidden in admin Panel

        module.exports = {
        actualites: {
            authActions: ["create", "readAny"],  // default permissions for Auth User :  create | readAny | readOwn | deleteAny | deleteOwn | updateOwn | updateAny
            publicActions:["readAny"] // readAny | createAny | deleteAny | updateAny
        },
        };
    `;
    fs.writeFileSync(path + file, buff)
    
    
});