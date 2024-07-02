package main

import (
	"github.com/gin-gonic/gin"
	"github.com/rumblefrog/go-a2s"
	"net/http"
	"time"
)

func main() {
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	})
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

	playerInfo, err := client.QueryPlayer()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal server error",
		})
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
