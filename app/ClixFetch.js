import isNil from 'lodash/isNil';
import isFunction from 'lodash/isFunction';

const clixFetch = async ($root, url, method, body = null, el = null, 
  errorText = 'Unknown Error') => {

  $root.setLoading(true);

  const fetchObj = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      'Accept-Type': 'application/json'
    })
  };

  if (!isNil(body)) {
    fetchObj.body = JSON.stringify(query);
  };

  const response = await fetch(url, fetchObj);

  const rBody = await response.json();

  $root.setLoading(false);

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
