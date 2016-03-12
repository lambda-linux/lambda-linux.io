//
// go build -o gohttpserver main.go
//

package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Serving files on port 80")
	http.Handle("/", http.FileServer(http.Dir(".")))
	err := http.ListenAndServe(":80", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
