export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function guid() {
  function _s4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    _s4() +
    _s4() +
    "-" +
    _s4() +
    "-" +
    _s4() +
    "-" +
    _s4() +
    "-" +
    _s4() +
    _s4() +
    _s4()
  );
}
