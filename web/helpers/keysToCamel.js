

export default function keysToCamel (o) {
    // https://matthiashager.com/converting-snake-case-to-camel-case-object-keys-with-javascript
    const toCamel = (s) => {
        return s.replace(/([-_][a-z])/ig, ($1) => {
          return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
        });
    };
    const isObject = function (x) {
        return x === Object(x) && !isArray(x) && typeof x !== 'function';
    };
    const isArray = function (a) {
        return Array.isArray(a);
    };
    if (isObject(o)) {
        const n = {};
    
        Object.keys(o)
        .forEach((k) => {
            n[toCamel(k)] = keysToCamel(o[k]);
        });
    
        return n;
    } else if (isArray(o)) {
        return o.map((i) => {
        return keysToCamel(i);
        });
    }
    return o;
}