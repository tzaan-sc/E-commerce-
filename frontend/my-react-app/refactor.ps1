$srcDir = "d:\E-commerce-\frontend\my-react-app\src"

# Define new directories
$newDirs = @(
    "$srcDir\components\layout",
    "$srcDir\components\widgets",
    "$srcDir\pages\Auth",
    "$srcDir\pages\Customer",
    "$srcDir\pages\Search"
)

foreach ($dir in $newDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
}

# Define folder mappings to move
$moves = @(
    # Layouts
    @("$srcDir\pages\user\mainLayout", "$srcDir\components\layout\MainLayout"),
    @("$srcDir\pages\user\header", "$srcDir\components\layout\Header"),
    @("$srcDir\pages\user\footer", "$srcDir\components\layout\Footer"),
    @("$srcDir\pages\customer\customerLayout", "$srcDir\components\layout\CustomerLayout"),
    @("$srcDir\pages\customer\header", "$srcDir\components\layout\CustomerHeader"),
    
    # Pages
    @("$srcDir\components\page\homePage", "$srcDir\pages\Home"),
    @("$srcDir\components\page\laptopPage", "$srcDir\pages\Laptop"),
    @("$srcDir\components\page\loginPage", "$srcDir\pages\Auth\Login"),
    @("$srcDir\components\page\registrationPage", "$srcDir\pages\Auth\Register"),
    @("$srcDir\components\page\forgotPasswordPage", "$srcDir\pages\Auth\ForgotPassword"),
    @("$srcDir\components\page\profilePage", "$srcDir\pages\Customer\Profile"),
    @("$srcDir\components\page\myOrderPage", "$srcDir\pages\Customer\MyOrder"),
    @("$srcDir\components\page\OrderDetailPage", "$srcDir\pages\Customer\OrderDetail"),
    @("$srcDir\components\page\cartPage", "$srcDir\pages\Cart"),
    @("$srcDir\components\user\checkoutPage", "$srcDir\pages\Checkout"),
    @("$srcDir\components\page\searchPage", "$srcDir\pages\Search\SearchPage"),
    @("$srcDir\components\page\brandProducts", "$srcDir\pages\Search\BrandProducts"),
    @("$srcDir\components\page\usagePurposeProducts", "$srcDir\pages\Search\UsagePurposeProducts"),
    
    # Import Product modal -> Admin
    @("$srcDir\components\page\ImportProductModal", "$srcDir\components\admin\ImportProductModal")
)

foreach ($m in $moves) {
    $source = $m[0]
    $dest = $m[1]
    if (Test-Path $source) {
        Move-Item -Path $source -Destination $dest -Force
        Write-Host "Moved $source to $dest"
    } else {
        Write-Host "Skipped $source (not found)"
    }
}

# Move Widgets
$userComponents = Get-ChildItem -Path "$srcDir\components\user" -Directory -ErrorAction SilentlyContinue
if ($userComponents) {
    foreach ($comp in $userComponents) {
        $dest = "$srcDir\components\widgets\$($comp.Name)"
        Move-Item -Path $comp.FullName -Destination $dest -Force
        Write-Host "Moved widget $($comp.Name) to $dest"
    }
}

# Clean abandoned empty directories (Best effort)
$rubs = @(
    "$srcDir\components\page",
    "$srcDir\components\user",
    "$srcDir\pages\user",
    "$srcDir\pages\customer"
)
foreach ($rub in $rubs) {
    if ((Test-Path $rub) -and (Get-ChildItem -Path $rub | Measure-Object).Count -eq 0) {
        Remove-Item -Path $rub -Force -Recurse
    }
}

Write-Host "File moving completed."
