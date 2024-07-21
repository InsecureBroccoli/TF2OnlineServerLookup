package main

import "regexp"

func validateAddress(address string) bool {
	ipv4Regex := "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(?:\\:\\d{0,5})?$"
	domainRegex := `^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$`

	ipv4Pattern := regexp.MustCompile(ipv4Regex)
	domainPattern := regexp.MustCompile(domainRegex)

	return ipv4Pattern.MatchString(address) || domainPattern.MatchString(address)
}
