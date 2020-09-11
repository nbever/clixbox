import isNil from 'lodash/isNil';
import isFunction from 'lodash/isFunction';

const clixFetch = async ($root, url, method, body = null, el = null, 
  errorText = 'Unknown Error', stringify = true, headers = null) => {

  $root.setLoading(true);

  const headerz = isNil(headers) ? 
    new Headers({
      'Content-Type': 'application/json',
      'Accept-Type': 'application/json'
    })
    :
    headers;

  const fetchObj = {
    method,
    headers: headerz
  };

  if (!isNil(body) && stringify === true) {
    fetchObj.body = JSON.stringify(body);
  };

  const response = await fetch(url, fetchObj);

  $root.setLoading(false);

  const rBody = await response.json();

  if (response.ok !== true) {
    const details = `${response.status}: ${response.statusText}`;
    const errorString = isNil(errorText) ? details : `${errorText}\n\n${details}`;

    if (isFunction(el.error)) {
      el.error(errorString);
    }

    if (isFunction($root.setError)) {
      $root.setError(errorString);
    }

    return null;
  }

  return rBody;
};

export {clixFetch};
