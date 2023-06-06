#!/bin/sh

# Esperar até que o banco de dados esteja pronto
./wait-for-it.sh -t 800 postgres_db:5432 -- echo "Database is up"

# Executar o comando para iniciar o backend
npm run dev