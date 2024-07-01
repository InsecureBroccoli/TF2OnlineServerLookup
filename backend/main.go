package main

import (
	"github.com/gin-gonic/gin"
	"github.com/rumblefrog/go-a2s"
	"net/http"
)

func main() {
	r := gin.Default()
	r.GET("/getserverinfo", getServerInfo)
	r.Run()
}

func getServerInfo(c *gin.Context) {
	address := c.Query("address")
	if address == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "missing required address query parameter",
		})
		return
	}

	client, err := a2s.NewClient(address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal server error",
		})
		return
	}

	defer client.Close()

	serverInfo, err := client.QueryInfo()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal server error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"name":        serverInfo.Name,
		"map":         serverInfo.Map,
		"players":     serverInfo.Players - serverInfo.Bots,
		"max_players": serverInfo.MaxPlayers,
		"bots":        serverInfo.Bots,
	})
}
