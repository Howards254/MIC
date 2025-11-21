#!/bin/bash

# MIC Platform Cleanup Script
# Removes unnecessary files and old migration scripts

echo "Starting cleanup..."

# Remove Firebase (not used)
rm -rf src/firebase/

# Remove unused pages
rm -f src/pages/InnovatorsPage.jsx
rm -f src/pages/InvestorsPage.jsx
rm -f src/pages/dashboard/Messages.jsx
rm -f src/pages/dashboard/JobApplications.jsx
rm -f src/pages/dashboard/Investments.jsx
rm -f src/pages/dashboard/DealFlow.jsx
rm -f src/pages/dashboard/Analytics.jsx

# Remove old SQL migration files (keep only essential ones)
rm -f supabase-schema.sql
rm -f database-updates.sql
rm -f complete-system-updates.sql
rm -f enhanced-profiles-schema.sql
rm -f investment-platform-schema.sql
rm -f investment-negotiation-system.sql
rm -f project-lifecycle-management.sql
rm -f donations-schema.sql
rm -f notifications-schema.sql
rm -f blog-schema.sql
rm -f fix-admin-permissions.sql
rm -f fix-investor-profiles-rls.sql
rm -f SIMPLE_FIX.sql
rm -f CHECK_SETUP.sql
rm -f MAKE_ADMIN.sql
rm -f MAKE_KAROL_ADMIN.sql

# Remove old documentation files
rm -f ADMIN_APPROVALS_DIAGNOSTIC.md
rm -f ADMIN_SETUP_GUIDE.md
rm -f BLOG_SETUP.md
rm -f CHANGES_SUMMARY.md
rm -f CHECK_DATABASE.md
rm -f DATA_FETCHING_FIXES.md
rm -f DEMO_DATA.sql
rm -f DEPLOYMENT.md
rm -f DONATION_SETUP.md
rm -f DONATION_STRATEGY.md
rm -f EDIT_DELETE_FEATURES.md
rm -f EQUITY_AND_PAYMENT_STRATEGY.md
rm -f FIX_ADMIN_APPROVALS.md
rm -f FIXES_APPLIED.md
rm -f FIXES_IMPLEMENTED.md
rm -f FIXES_SUMMARY.md
rm -f IMPLEMENTATION_ROADMAP.md
rm -f INVESTMENT_PLATFORM_GUIDE.md
rm -f INVESTOR_INNOVATOR_CONNECTION.md
rm -f MONETIZATION_STRATEGY.md
rm -f NEGOTIATION_SYSTEM_GUIDE.md
rm -f NEW_USER_FLOW.md
rm -f NOTIFICATIONS_SETUP.md
rm -f PROJECT_DONATION_IMPLEMENTATION.md
rm -f PROJECT_SUMMARY.md
rm -f QUICK_REFERENCE.md
rm -f QUICKSTART.md
rm -f SIGNUP_ERROR_FIX.md
rm -f START_HERE.md
rm -f SYSTEM_FLOW_ANALYSIS.md
rm -f TESTING_GUIDE.md

# Keep these essential files:
# - README.md
# - SETUP.md
# - new-platform-schema.sql
# - add-category-column.sql
# - add-optional-project-fields.sql
# - fix-rls-policies.sql
# - TESTING_CHECKLIST.md
# - NEW_SYSTEM_OVERVIEW.md
# - MIGRATION_GUIDE.md
# - COMPREHENSIVE_FIXES.md

echo "Cleanup complete!"
echo ""
echo "Essential files kept:"
echo "- README.md"
echo "- SETUP.md"
echo "- new-platform-schema.sql"
echo "- add-category-column.sql"
echo "- add-optional-project-fields.sql"
echo "- fix-rls-policies.sql"
echo "- TESTING_CHECKLIST.md"
echo "- NEW_SYSTEM_OVERVIEW.md"
echo "- MIGRATION_GUIDE.md"
echo "- COMPREHENSIVE_FIXES.md"
