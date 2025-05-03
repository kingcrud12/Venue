package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	_ "github.com/lib/pq"
)

const (
	uploadDir    = "./uploads"
	dbConnString = "postgres://user:password@localhost:5432/mydatabase?sslmode=disable"
)

func main() {
	// Ensure upload directory exists
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		log.Fatal("Failed to create upload directory:", err)
	}

	http.HandleFunc("/upload", fileUploadHandler)

	log.Println("Server listening on :3080")
	log.Fatal(http.ListenAndServe(":3080", nil))
}

func fileUploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse file from the form
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to read file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Save file locally
	filePath := filepath.Join(uploadDir, header.Filename)
	outFile, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}
	defer outFile.Close()
	io.Copy(outFile, file)

	fmt.Fprintf(w, "File uploaded successfully: %s", header.Filename)
}
