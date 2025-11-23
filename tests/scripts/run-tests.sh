#!/bin/bash

# MIC Testing Helper Script
# This script helps you run different types of tests easily

echo "=================================="
echo "MIC Testing Suite"
echo "=================================="
echo ""

show_menu() {
    echo "Select test type to run:"
    echo "1) Run all unit tests"
    echo "2) Run tests in watch mode"
    echo "3) Run tests with coverage"
    echo "4) Run tests with UI"
    echo "5) Run Cypress E2E tests (interactive)"
    echo "6) Run Cypress E2E tests (headless)"
    echo "7) Run ALL tests (unit + E2E)"
    echo "8) View test documentation"
    echo "9) Exit"
    echo ""
    read -p "Enter your choice [1-9]: " choice
}

run_unit_tests() {
    echo "Running unit tests..."
    npm run test
}

run_watch_tests() {
    echo "Running tests in watch mode..."
    npm run test:watch
}

run_coverage() {
    echo "Running tests with coverage report..."
    npm run test:coverage
}

run_ui_tests() {
    echo "Running tests with UI..."
    npm run test:ui
}

run_cypress_open() {
    echo "Opening Cypress Test Runner..."
    npm run cypress:open
}

run_cypress_headless() {
    echo "Running Cypress tests in headless mode..."
    npm run cypress:run
}

run_all_tests() {
    echo "Running ALL tests (this may take a while)..."
    npm run test:all
}

view_docs() {
    if [ -f "TESTING_GUIDE.md" ]; then
        cat TESTING_GUIDE.md
    else
        echo "Documentation not found!"
    fi
}

while true; do
    show_menu
    
    case $choice in
        1)
            run_unit_tests
            ;;
        2)
            run_watch_tests
            ;;
        3)
            run_coverage
            ;;
        4)
            run_ui_tests
            ;;
        5)
            run_cypress_open
            ;;
        6)
            run_cypress_headless
            ;;
        7)
            run_all_tests
            ;;
        8)
            view_docs
            ;;
        9)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid option. Please choose 1-9."
            ;;
    esac
    
    echo ""
    echo "Press Enter to continue..."
    read
    clear
done
