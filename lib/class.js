import package_ from "../package.json"
import _ from "lodash"
import qs from "qs"
import fetch  from "node-fetch"
import cleanDeep from "clean-deep"
import consola from "consola"
import Cookies from "js-cookie";
import { cleanDoubleSlashes, normalizeURL } from "ufo";
class Payload {
  constructor(
    config = {
      key: "payload-" + window.origin,
      apiURL: "http://localhost:3000/api",
      mediaURL: "http://localhost:3000/media",
      debug: true,
    }
  ) {
    // Formats config
    config.apiURL = this.cleanDoubleSlashes(config.apiURL);

    this.config = config;
    this.Cookies = Cookies;
    this.jwt = this.Cookies.get(config.key) || null;
    this._init();
  }

  _init() {
    return this.config.debug
      ? consola.success(`Payload CMS SDK  running ¬  ${package_.version}\n`)
      : "";
  }
  _authorization() {
    // Authorization token header
    const requestWithToken = {
      authorization: "JWT "+this.jwt,
    };

    return this.jwt ? requestWithToken : null;
  }

  cleanDoubleSlashes(url, slash = true) {
    if (url !== "") {
      // format apiURL
      url = normalizeURL(cleanDoubleSlashes(url));
      if (url.slice(-1) !== "/") {
        url = slash ? url + "/" : url;
      }
    }
    return normalizeURL(cleanDoubleSlashes(url));
  }

  async find(
    entry = "",
    params,
    options = {
      preserveNullAndEmpty: true,
    }
  ) {
    // find

    if (!options.preserveNullAndEmpty) {
      params = cleanDeep(params);
    }
    var query = qs.stringify(params, {
      addQueryPrefix: true,
      
    });
    var url_ = this.cleanDoubleSlashes(
      this.config.apiURL + entry + query,
      false
    );
    return new Promise(async (resolve, reject) => {
      try {
        var response = await fetch(url_, {
          headers: {
            ...this._authorization(),
          },
        });

        var details = await response
          .json()
          .then((e) => e)
          .catch(async (err) => await response.statusText);
        if (!response.ok) {
          return reject(details);
        }

        this.debug ? consola.success(details) : "";
        resolve(details);
      } catch (err) {
        return reject(err);
      }
    });
  }

  async findOne(entry = "", id = null) {
    var url_ = this.cleanDoubleSlashes(
      this.config.apiURL + entry + "/" + id,
      false
    );

    console.log(url_);
    return new Promise(async (resolve, reject) => {
      try {
        var response = await fetch(url_, {
          headers: {
            ...this._authorization(),
          },
        });

        var details = await response
          .json()
          .then((e) => e)
          .catch(async (err) => await response.statusText);
        if (!response.ok) {
          return reject(details);
        }

        this.debug ? consola.success(details) : "";
        resolve(details);
      } catch (err) {
        return reject(err);
      }
    });
  }

  async create(
    entry,
    data = {},
    options = {
      preserveNullAndEmpty: true,
    }
  ) {
    // create

    if (!options.preserveNullAndEmpty) {
      data = cleanDeep(data);
    }

    var url_ = this.cleanDoubleSlashes(this.config.apiURL + entry, false);
    return new Promise(async (resolve, reject) => {
      try {
        var response = await fetch(url_, {
          method: "POST",
          headers: {
            ...this._authorization(),
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        });

        var details = await response
          .json()
          .then((e) => e)
          .catch(async (err) => await response.statusText);
        if (!response.ok) {
          return reject(details);
        }

        this.debug ? consola.success(details) : "";
        resolve(details);
      } catch (err) {
        return reject(err);
      }
    });
  }

  async update(
    entry = "",
    id = null,
    data = {},
    options = {
      preserveNullAndEmpty: true,
    }
  ) {
    if (!options.preserveNullAndEmpty) {
      data = cleanDeep(data);
    }

    var url_ = this.cleanDoubleSlashes(
      this.config.apiURL + entry + "/" + id,
      false
    );
    return new Promise(async (resolve, reject) => {
      try {
        var response = await fetch(url_, {
          method: "PUT",
          headers: {
            ...this._authorization(),
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        });

        var details = await response
          .json()
          .then((e) => e)
          .catch(async (err) => await response.statusText);
        if (!response.ok) {
          return reject(details);
        }

        this.debug ? consola.success(details) : "";
        resolve(details);
      } catch (err) {
        return reject(err);
      }
    });
  }

  async deleteOne(entry = "", id = null) {
    var url_ = this.cleanDoubleSlashes(
      this.config.apiURL + entry + "/" + id,
      false
    );

    return new Promise(async (resolve, reject) => {
      try {
        var response = await fetch(url_, {
          method: "DELETE",
          headers: {
            ...this._authorization(),
          },
        });

        var details = await response
          .json()
          .then((e) => e)
          .catch(async (err) => await response.statusText);
        if (!response.ok) {
          return reject(details);
        }

        this.debug ? consola.success(details) : "";
        resolve(details);
      } catch (err) {
        return reject(err);
      }
    });
  }

  async login(
    entry = "",
    data = {},
    options = {
      preserveNullAndEmpty: true,
    }
  ) {
 
    if (!options.preserveNullAndEmpty) {
      data = cleanDeep(data);
    }

    var url_ = this.cleanDoubleSlashes(
      this.config.apiURL + entry + "/login",
      false
    );
    return new Promise(async (resolve, reject) => {
      try {
        var response = await fetch(url_, {
          method: "POST",
          headers: {
            ...this._authorization(),
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        });

        var details = await response
          .json()
          .then((e) => e)
          .catch(async (err) => await response.statusText);
        if (!response.ok) {
          return reject(details);
        }
        this.Cookies.set(this.config.key, details.token);
        this.jwt = details.token
        this.debug ? consola.success(details) : "";
        resolve(details);
      } catch (err) {
        return reject(err);
      }
    });
  }

  async logout(entry = "") {
    var url_ = this.cleanDoubleSlashes(
      this.config.apiURL + entry + "/logout",
      false
    );
    return new Promise(async (resolve, reject) => {
      try {
        var response = await fetch(url_, {
          method: "POST",
          headers: {
            ...this._authorization(),
            "content-type": "application/json",
          },
          //body: JSON.stringify(data),
        });

        var details = await response
          .json()
          .then((e) => e)
          .catch(async (err) => await response.statusText);
        if (!response.ok) {
          return reject(details);
        }

        this.debug ? consola.success(details) : "";
        resolve(details);
      } catch (err) {
        return reject(err);
      }
    });
  }

  async me(entry = "") {
    var url_ = this.cleanDoubleSlashes(
      this.config.apiURL + entry + "/me",
      false
    );

    console.log(url_);
    return new Promise(async (resolve, reject) => {
      try {
        var response = await fetch(url_, {
          headers: {
            ...this._authorization(),
            "content-type": "application/json",
          },
          //body: JSON.stringify(data),
        });

        var details = await response
          .json()
          .then((e) => e)
          .catch(async (err) => await response.statusText);
        if (!response.ok) {
          return reject(details);
        }

        this.debug ? consola.success(details) : "";
        resolve(details);
      } catch (err) {
        return reject(err);
      }
    });
  }

  async access() {
    var url_ = this.cleanDoubleSlashes(this.config.apiURL + "/access", false);
    return new Promise(async (resolve, reject) => {
      try {
        var response = await fetch(url_, {
          headers: {
            ...this._authorization(),
            "content-type": "application/json",
          },
          //body: JSON.stringify(data),
        });

        var details = await response
          .json()
          .then((e) => e)
          .catch(async (err) => await response.statusText);
        if (!response.ok) {
          return reject(details);
        }

        this.debug ? consola.success(details) : "";
        resolve(details);
      } catch (err) {
        return reject(err);
      }
    });
  }

  async setToken(token) {
    this.Cookies.set(this.config.key, token);
    this.jwt = token;
    if (this.debug) consola.log("Token is set with key ", this.config.key);
  }

  async clearToken() {
    this.Cookies.remove(this.config.key);
    this.jwt = null;
    if (this.debug) consola.log("Token removed  ", this.config.key);
  }

  async raw() {}

  async aggregate() {}
}


export {
  Payload
}