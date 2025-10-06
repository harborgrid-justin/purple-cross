#!/bin/bash

# Bulk Refactor Services Script
# This script applies constant replacements to all service files

echo "Starting bulk service refactoring..."

# Define the services directory
SERVICES_DIR="backend/src/services"

# Function to refactor a single file
refactor_file() {
    local file=$1
    echo "Refactoring: $file"

    # Check if constants import exists
    if ! grep -q "from '../constants'" "$file"; then
        # Find the last import line
        last_import=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)

        # Add constants import after last import
        if [ -n "$last_import" ]; then
            sed -i "${last_import}a\\import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, QUERY_LIMITS, STATUS } from '../constants';" "$file"
        fi
    fi

    # Apply regex replacements
    sed -i "s/throw new AppError('\([^']*\) not found', 404)/throw new AppError(ERROR_MESSAGES.NOT_FOUND('\1'), HTTP_STATUS.NOT_FOUND)/g" "$file"
    sed -i "s/throw new AppError('\([^']*\) already exists', 400)/throw new AppError(ERROR_MESSAGES.ALREADY_EXISTS('\1'), HTTP_STATUS.BAD_REQUEST)/g" "$file"
    sed -i "s/page = 1, limit = 20/page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT/g" "$file"
    sed -i "s/page = 1/page = PAGINATION.DEFAULT_PAGE/g" "$file"
    sed -i "s/limit = 20/limit = PAGINATION.DEFAULT_LIMIT/g" "$file"
    sed -i "s/mode: 'insensitive'/mode: QUERY_MODE.INSENSITIVE/g" "$file"
    sed -i "s/orderBy: { createdAt: 'desc' }/orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }/g" "$file"
    sed -i "s/orderBy: { visitDate: 'desc' }/orderBy: { [FIELDS.VISIT_DATE]: SORT_ORDER.DESC }/g" "$file"
    sed -i "s/orderBy: { startTime: 'desc' }/orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC }/g" "$file"
    sed -i "s/orderBy: { invoiceDate: 'desc' }/orderBy: { [FIELDS.INVOICE_DATE]: SORT_ORDER.DESC }/g" "$file"
    sed -i "s/orderBy: { name: 'asc' }/orderBy: { [FIELDS.NAME]: SORT_ORDER.ASC }/g" "$file"
    sed -i "s/status: { not: 'cancelled' }/status: { not: STATUS.CANCELLED }/g" "$file"
}

# Refactor all service files
for service_file in $SERVICES_DIR/*.service.ts; do
    if [ -f "$service_file" ]; then
        refactor_file "$service_file"
    fi
done

echo "Refactoring complete!"
echo "Running type check..."

cd backend && npm run typecheck

if [ $? -eq 0 ]; then
    echo "✓ Type check passed!"
else
    echo "✗ Type check failed. Please review the changes."
fi
