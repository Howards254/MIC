#!/bin/bash

# Apply Database Migration Script
# This script helps you apply the complete-schema-with-rls.sql migration

echo "=================================================="
echo "  Database Migration Helper"
echo "  Maathai Innovation Catalyst"
echo "=================================================="
echo ""
echo "To apply the migration, follow these steps:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/hhtiutkjtfchqpgplblp"
echo ""
echo "2. Navigate to: SQL Editor (left sidebar)"
echo ""
echo "3. Click: 'New Query'"
echo ""
echo "4. Copy the SQL file:"
echo "   File location: $(pwd)/complete-schema-with-rls.sql"
echo ""
echo "5. Paste the contents into the SQL editor"
echo ""
echo "6. Click: 'Run' button"
echo ""
echo "=================================================="
echo ""
echo "The migration will create:"
echo "  ✓ 12 database tables"
echo "  ✓ Row Level Security policies"
echo "  ✓ Automatic triggers"
echo "  ✓ Performance indexes"
echo "  ✓ User signup automation"
echo ""
echo "=================================================="
echo ""
read -p "Would you like to open the SQL file now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cat complete-schema-with-rls.sql
fi
