export function encodeInUrl(object: any) {
    if (!object) {
      return "";
    }
    var formBody: string[] = [];
    for (var property in object) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(object[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    return "?" + formBody.join("&");
  }
  