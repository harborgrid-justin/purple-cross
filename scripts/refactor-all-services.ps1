# PowerShell script to refactor all service files
# Run with: powershell -ExecutionPolicy Bypass -File scripts/refactor-all-services.ps1

Write-Host "Starting bulk service refactoring..." -ForegroundColor Green

$servicesPath = "backend\src\services"
$serviceFiles = Get-ChildItem -Path $servicesPath -Filter "*.service.ts"

$constantsImport = "import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, QUERY_LIMITS, STATUS } from '../constants';"

$replacements = @(
    @{Pattern = "throw new AppError\('([^']+) not found', 404\)"; Replacement = "throw new AppError(ERROR_MESSAGES.NOT_FOUND('`$1'), HTTP_STATUS.NOT_FOUND)"},
    @{Pattern = "throw new AppError\('([^']+) already exists', 400\)"; Replacement = "throw new AppError(ERROR_MESSAGES.ALREADY_EXISTS('`$1'), HTTP_STATUS.BAD_REQUEST)"},
    @{Pattern = "throw new AppError\(`"([^`"]+) not found`", 404\)"; Replacement = "throw new AppError(ERROR_MESSAGES.NOT_FOUND('`$1'), HTTP_STATUS.NOT_FOUND)"},
    @{Pattern = "throw new AppError\(`"([^`"]+) already exists`", 400\)"; Replacement = "throw new AppError(ERROR_MESSAGES.ALREADY_EXISTS('`$1'), HTTP_STATUS.BAD_REQUEST)"},
    @{Pattern = "\bpage = 1, limit = 20\b"; Replacement = "page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT"},
    @{Pattern = "\bpage = 1\b"; Replacement = "page = PAGINATION.DEFAULT_PAGE"},
    @{Pattern = "\blimit = 20\b"; Replacement = "limit = PAGINATION.DEFAULT_LIMIT"},
    @{Pattern = "mode: 'insensitive'"; Replacement = "mode: QUERY_MODE.INSENSITIVE"},
    @{Pattern = 'mode: "insensitive"'; Replacement = "mode: QUERY_MODE.INSENSITIVE"},
    @{Pattern = "orderBy: \{ createdAt: 'desc' \}"; Replacement = "orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }"},
    @{Pattern = 'orderBy: \{ createdAt: "desc" \}'; Replacement = "orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }"},
    @{Pattern = "orderBy: \{ visitDate: 'desc' \}"; Replacement = "orderBy: { [FIELDS.VISIT_DATE]: SORT_ORDER.DESC }"},
    @{Pattern = 'orderBy: \{ visitDate: "desc" \}'; Replacement = "orderBy: { [FIELDS.VISIT_DATE]: SORT_ORDER.DESC }"},
    @{Pattern = "orderBy: \{ startTime: 'desc' \}"; Replacement = "orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC }"},
    @{Pattern = 'orderBy: \{ startTime: "desc" \}'; Replacement = "orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC }"},
    @{Pattern = "orderBy: \{ invoiceDate: 'desc' \}"; Replacement = "orderBy: { [FIELDS.INVOICE_DATE]: SORT_ORDER.DESC }"},
    @{Pattern = 'orderBy: \{ invoiceDate: "desc" \}'; Replacement = "orderBy: { [FIELDS.INVOICE_DATE]: SORT_ORDER.DESC }"},
    @{Pattern = "orderBy: \{ name: 'asc' \}"; Replacement = "orderBy: { [FIELDS.NAME]: SORT_ORDER.ASC }"},
    @{Pattern = 'orderBy: \{ name: "asc" \}'; Replacement = "orderBy: { [FIELDS.NAME]: SORT_ORDER.ASC }"},
    @{Pattern = "status: \{ not: 'cancelled' \}"; Replacement = "status: { not: STATUS.CANCELLED }"},
    @{Pattern = 'status: \{ not: "cancelled" \}'; Replacement = "status: { not: STATUS.CANCELLED }"},
    @{Pattern = "\btake: 10\b"; Replacement = "take: QUERY_LIMITS.RECENT_ITEMS"},
    @{Pattern = "\btake: 5\b"; Replacement = "take: QUERY_LIMITS.APPOINTMENTS"}
)

$totalFiles = 0
$modifiedFiles = 0

foreach ($file in $serviceFiles) {
    $totalFiles++
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $modified = $false

    # Check if constants import already exists
    $hasConstantsImport = $content -match "from '\.\./constants'" -or $content -match 'from "\.\./constants"'

    # Apply replacements
    foreach ($replacement in $replacements) {
        if ($content -match $replacement.Pattern) {
            $content = $content -replace $replacement.Pattern, $replacement.Replacement
            $modified = $true
        }
    }

    # Add import if modified and not already present
    if ($modified -and -not $hasConstantsImport) {
        # Find the last import line
        $lines = $content -split "`n"
        $lastImportIndex = -1

        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "^import ") {
                $lastImportIndex = $i
            }
        }

        if ($lastImportIndex -ge 0) {
            $lines = @($lines[0..$lastImportIndex]) + @($constantsImport) + @($lines[($lastImportIndex + 1)..($lines.Count - 1)])
            $content = $lines -join "`n"
        }
    }

    # Write back if modified
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  [✓] Refactored: $($file.Name)" -ForegroundColor Cyan
        $modifiedFiles++
    } else {
        Write-Host "  [ ] Skipped: $($file.Name) (no changes needed)" -ForegroundColor Gray
    }
}

Write-Host "`nRefactoring complete!" -ForegroundColor Green
Write-Host "Modified $modifiedFiles out of $totalFiles files.`n" -ForegroundColor Yellow

Write-Host "Running type check..." -ForegroundColor Green
Set-Location backend
$typeCheckResult = npm run typecheck 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Type check passed!" -ForegroundColor Green
} else {
    Write-Host "[✗] Type check failed. Output:" -ForegroundColor Red
    Write-Host $typeCheckResult -ForegroundColor Red
}
Set-Location ..
