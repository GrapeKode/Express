export default (...args) => {
  const valuePass = args[0],
        valueCheck = args[1];
  let result = {};

  for( let key in valuePass ) {
    if( valueCheck[key].hasOwnProperty('checked') ) {
      if( !valuePass[key] && !valueCheck[key].presence.allowEmpty )
        result[key] = valueCheck[key].presence.message
    } else {
      if( key === 'email' ) {
        if( !valuePass[key].match(valueCheck[key].match) ) 
          result[key] = 'is invalid'
      } else if( valuePass[key] === '' && !valueCheck[key].presence.allowEmpty )
        result[key] = valueCheck[key].presence.message
      else if( valuePass[key].length > valueCheck[key].length.maximum )
        result[key] = `Only ${valueCheck[key].length.maximum} characters are allowed`
      else if( valuePass[key].length < valueCheck[key].length.minimum )
        result[key] = `must have minimum of ${valueCheck[key].length.minimum} characters`
    }
  }
  
  return Object.keys(result).length !== 0 && result
}