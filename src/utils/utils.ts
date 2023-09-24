
export function range(start: number, end: number) {
	return Array(end - start ).fill(1).map( (_, id) => id + start );
}

export function tracateString(str:string, len:number) {
	if (str.length <= len) return str;
	return str.substring(0, len) + '...';
}

export function getQueryString (name: string | string[], href = window.location.href): any {
  const getMatch = (val: string) => {
    const reg = new RegExp('(^|&)' + val + '=([^&]*)(&|$)', 'i')
    const match = query ? query.match(reg) : null
    return match ? unescape(match[2]) : null
  }
  const query = href.split('?')[1]
  if (Array.isArray(name)) {
    return (name as string[]).map((val: string) => getMatch(val))
  }
  return getMatch(name as string)
}

export function hasPermission (val) {
  return !!window.$permissionMap[val]
}