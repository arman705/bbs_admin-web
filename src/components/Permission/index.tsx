export default function Permission ({
  perms,
  children
}) {
  if (perms) {
    const target = window.$permissionMap[perms]
    return target ? children : null
  } else {
    return children
  }
}