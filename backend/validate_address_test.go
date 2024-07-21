package main

import (
	"testing"
)

func TestValidateAddress(t *testing.T) {
	tests := []struct {
		name     string
		domain   string
		expected bool
	}{
		{"Valid simple domain", "example.com", true},
		{"Valid subdomain", "sub.example.co.uk", true},
		{"Valid domain with hyphen", "my-site.com", true},
		{"Valid IP-like domain", "123.456.789.01", true},
		{"Valid IP with port", "123.456.789.01:27015", true},
		{"Invalid domain with space", "invalid domain.com", false},
		{"Invalid domain starting with hyphen", "-invalid.com", false},
		{"Invalid domain ending with hyphen", "invalid-.com", false},
		{"Invalid domain with consecutive dots", "inv..alid.com", false},
		{"Valid long subdomain", "this.is.a.very.long.subdomain.example.com", true},
		{"Valid domain with numbers", "123.456.com", true},
		{"Invalid domain with underscore", "invalid_domain.com", false},
		{"Invalid domain ending with dot", "invalid.com.", false},
		{"Invalid domain starting with dot", ".invalid.com", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := validateAddress(tt.domain)
			if result != tt.expected {
				t.Errorf("isValidDomain(%q) = %v, want %v", tt.domain, result, tt.expected)
			}
		})
	}
}
