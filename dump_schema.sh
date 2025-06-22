#!/bin/bash

# Skrypt do pobierania struktury bazy Supabase
# Użycie: ./dump_schema.sh

CONNECTION_STRING="postgresql://postgres.vvkjfzjikfuqdpmomdbx:mmNj8DAhwxzT3lMlPtjI@aws-0-eu-north-1.pooler.supabase.com:5432/postgres"
OUTPUT_FILE="schema.sql"

echo "Pobieranie struktury bazy danych..."

# Uruchom psql i pobierz strukture, usuń formatowanie
psql "$CONNECTION_STRING" -t -c "
SELECT 
  'CREATE TABLE ' || table_name || ' (' || chr(10) ||
  string_agg(
    '  ' || column_name || ' ' || 
    CASE 
      WHEN data_type = 'ARRAY' THEN 'TEXT[]'
      WHEN data_type = 'timestamp with time zone' THEN 'TIMESTAMPTZ'
      ELSE UPPER(data_type)
    END ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
    CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END,
    ',' || chr(10)
    ORDER BY ordinal_position
  ) ||
  chr(10) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public'
GROUP BY table_name
ORDER BY table_name;
" | sed 's/+$//' | sed 's/^ *//' > "$OUTPUT_FILE"

echo "Struktura zapisana do: $OUTPUT_FILE"
echo "Usuwanie śmieci z pliku..."

# Wyczyść plik z nagłówków i pustych linii
sed -i '/create_statement/d' "$OUTPUT_FILE"
sed -i '/^-\+$/d' "$OUTPUT_FILE"
sed -i '/^([0-9]* row/d' "$OUTPUT_FILE"
sed -i '/^$/d' "$OUTPUT_FILE"

echo "Gotowe! Sprawdź plik: $OUTPUT_FILE"
cat "$OUTPUT_FILE"