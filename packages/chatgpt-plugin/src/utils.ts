function ipToInt(ip: string) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0)
}

function isIpInCIDR(ip: string, cidr: string) {
  const [cidrIp, prefixLength] = cidr.split('/')
  const mask = -1 << (32 - parseInt(prefixLength))
  const ipInt = ipToInt(ip)
  const cidrIpInt = ipToInt(cidrIp)

  const networkAddress = cidrIpInt & mask
  const broadcastAddress = networkAddress | ~mask

  return ipInt >= networkAddress && ipInt <= broadcastAddress
}

/**
 * Validates that the given IP address is in the range of IP addresses
 * documented by OpenAI's production ChatGPT Plugin docs.
 *
 * Credit to [Steven Tey](https://gist.github.com/steven-tey/994ae6be0da254ebbdf28d06623874ec) for the original implementation.
 *
 * @see https://platform.openai.com/docs/plugins/production/ip-egress-ranges
 */
export function isValidChatGPTIPAddress(ip: string) {
  if (!ip) return false

  // verify both CIDR blocks
  return (
    isIpInCIDR(ip, '23.102.140.112/28') || isIpInCIDR(ip, '23.98.142.176/28')
  )
}
