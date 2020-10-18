const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("kasir")
    .readOwn("profile")
    .updateOwn("profile")

  ac.grant("manager")
    .extend("kasir")
    .readAny("profile")

  ac.grant("bos")
    .extend("kasir")
    .extend("manager")
    .updateAny("profile")
    .deleteAny("profile")

  return ac;
})();
