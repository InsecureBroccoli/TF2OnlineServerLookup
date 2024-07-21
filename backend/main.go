package main

import (
	"github.com/gin-gonic/gin"
	"github.com/rumblefrog/go-a2s"
	"log"
	"net/http"
	"time"
)

func main() {
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	})
	r.GET("/api/v1/getserverinfo", getServerInfo)
	r.Run()
}

func getServerInfo(c *gin.Context) {
	address := c.Query("address")
	if address == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Missing required address query parameter",
		})
		log.Println("missing required address query parameter")
		return
	}

	if !validateAddress(address) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid address",
		})
		log.Println("invalid address")
		return
	}

	client, err := a2s.NewClient(address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Internal server error",
		})
		log.Println("unable to create a2s client:", err)
		return
	}

	defer client.Close()

	serverInfo, err := client.QueryInfo()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to get server info",
		})
		log.Println("unable to query server info:", err)
		return
	}

	playerInfo, err := client.QueryPlayer()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Unable to get player info",
		})
		log.Println("unable to query player info:", err)
		return
	}

	players := make([]gin.H, 0, len(playerInfo.Players))
	for _, player := range playerInfo.Players {
		players = append(players, gin.H{
			"name":     player.Name,
			"score":    player.Score,
			"duration": time.Duration(player.Duration * float32(time.Second)).Round(time.Millisecond).String(),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"name":         serverInfo.Name,
		"map":          serverInfo.Map,
		"player_count": serverInfo.Players - serverInfo.Bots,
		"max_players":  serverInfo.MaxPlayers,
		"bot_count":    serverInfo.Bots,
		"players":      players,
	})
}
